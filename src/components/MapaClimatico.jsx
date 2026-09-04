import React, { useCallback, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  CLIMATE_CRITERIA,
  fetchClimateForLocation,
  validateCoordinates,
} from '../lib/climate';

// São Paulo é apenas o centro inicial para o usuário enxergar o Brasil. Eu não
// faço nenhuma análise até ele realmente selecionar uma coordenada.
const INITIAL_POSITION = [-23.5505, -46.6333];

// Espero um instante antes da consulta para evitar várias chamadas enquanto o
// marcador está sendo ajustado rapidamente.
const REQUEST_DEBOUNCE_MS = 450;

// Crio o desenho do marcador no próprio código para não depender de outra imagem.
const PROPERTY_MARKER_ICON = L.divIcon({
  className: 'property-marker-shell',
  html: `
    <svg viewBox="0 0 40 52" role="img" aria-label="Local selecionado">
      <path d="M20 1C9.5 1 1 9.5 1 20c0 14.2 19 31 19 31s19-16.8 19-31C39 9.5 30.5 1 20 1Z" />
      <circle cx="20" cy="20" r="7" />
    </svg>
  `,
  iconSize: [40, 52],
  iconAnchor: [20, 50],
});

// Exibo números com vírgula decimal seguindo o padrão brasileiro.
function formatNumber(value, digits = 1) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

// Converto a data ISO da API para uma data legível sem mudar o dia pelo fuso.
function formatDate(isoDate) {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(
    new Date(`${isoDate}T12:00:00Z`),
  );
}

// Este pequeno componente mantém as três métricas com o mesmo formato visual.
function Metric({ icon, label, value, unit }) {
  return (
    <div className="climate-metric">
      <span className="climate-metric-icon" aria-hidden="true">
        {icon}
      </span>
      <span>
        <small>{label}</small>
        <strong>
          {value} <span>{unit}</span>
        </strong>
      </span>
    </div>
  );
}

// Esta linha compara o valor calculado com uma faixa e mostra se o critério passou.
function CriteriaRow({ label, expected, actual, passed }) {
  return (
    <li className={passed ? 'criterion-pass' : 'criterion-review'}>
      <span aria-hidden="true">{passed ? '✓' : '!'}</span>
      <span>
        <strong>{label}</strong>
        <small>
          {passed ? 'Critério atendido' : 'Fora da faixa'} · {actual} ·
          referência: {expected}
        </small>
      </span>
    </li>
  );
}

// Este é o card completo da nova funcionalidade da Fase 5.
export default function MapaClimatico() {
  // As referências guardam objetos externos do Leaflet. Como elas não fazem parte
  // do JSX, posso atualizá-las sem provocar uma nova renderização do React.
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const selectLocationRef = useRef(null);

  // Este contador impede que uma geolocalização antiga substitua uma escolha mais nova.
  const geolocationRequestIdRef = useRef(0);

  // Estes estados representam a escolha do usuário, o formulário de coordenadas,
  // o resultado recebido e as mensagens mostradas durante a consulta.
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [coordinateDraft, setCoordinateDraft] = useState({
    latitude: '',
    longitude: '',
  });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState('');
  const [geolocationError, setGeolocationError] = useState('');

  // Centralizo toda forma de seleção (clique, arraste, GPS ou digitação) nesta função.
  const selectLocation = useCallback(({ lat, lng }) => {
    const normalizedLocation = {
      lat: Number(lat.toFixed(5)),
      lng: Number(lng.toFixed(5)),
    };

    // Uma escolha manual invalida qualquer pedido de GPS que ainda esteja aberto.
    geolocationRequestIdRef.current += 1;
    setIsLocating(false);
    setSelectedLocation(normalizedLocation);
    setCoordinateDraft({
      latitude: String(normalizedLocation.lat),
      longitude: String(normalizedLocation.lng),
    });
    setResult(null);
    setError('');
    setGeolocationError('');
  }, []);

  // O Leaflet usa esta referência para sempre chamar a versão atual da função.
  selectLocationRef.current = selectLocation;

  // Crio o mapa uma única vez quando o componente aparece na página.
  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) return undefined;

    const map = L.map(mapElementRef.current, {
      scrollWheelZoom: false,
      zoomControl: true,
    }).setView(INITIAL_POSITION, 5);

    // O desenho de ruas e limites vem dos tiles públicos do OpenStreetMap.
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Um clique entrega latitude e longitude para o mesmo fluxo de seleção.
    const handleMapClick = ({ latlng }) => {
      selectLocationRef.current?.(latlng);
    };

    map.on('click', handleMapClick);
    mapRef.current = map;

    // Recalculo o mapa se o card mudar de tamanho, principalmente em telas menores.
    const resizeObserver = new ResizeObserver(() => map.invalidateSize(false));
    resizeObserver.observe(mapElementRef.current);
    window.setTimeout(() => map.invalidateSize(false), 0);

    return () => {
      // Ao sair da página eu removo eventos e o mapa para não prender recursos na memória.
      resizeObserver.disconnect();
      map.off('click', handleMapClick);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Sincronizo o marcador do Leaflet sempre que o estado do React muda.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedLocation) return;

    if (!markerRef.current) {
      // Na primeira seleção eu crio um marcador acessível, arrastável e controlável.
      const marker = L.marker([selectedLocation.lat, selectedLocation.lng], {
        alt: 'Marcador da propriedade selecionada',
        draggable: true,
        icon: PROPERTY_MARKER_ICON,
        keyboard: true,
        title: 'Arraste para ajustar a localização',
      }).addTo(map);

      // Quando o arraste termina, a nova posição volta ao fluxo central de seleção.
      marker.on('dragend', () => {
        const { lat, lng } = marker.getLatLng();
        selectLocationRef.current?.({ lat, lng });
      });

      markerRef.current = marker;
    } else {
      markerRef.current.setLatLng([selectedLocation.lat, selectedLocation.lng]);
    }
  }, [selectedLocation]);

  // Depois da seleção, consulto as APIs climáticas e guardo o resultado no estado.
  useEffect(() => {
    if (!selectedLocation) return undefined;

    // O AbortController cancela a consulta anterior se o usuário trocar o ponto.
    const controller = new AbortController();
    let isActive = true;

    setIsLoading(true);
    setResult(null);
    setError('');

    // O temporizador implementa a pequena espera definida no início do arquivo.
    const requestTimer = window.setTimeout(() => {
      fetchClimateForLocation(selectedLocation.lat, selectedLocation.lng, {
        signal: controller.signal,
      })
        .then((climateResult) => {
          if (isActive) setResult(climateResult);
        })
        .catch((requestError) => {
          if (isActive && requestError?.name !== 'AbortError') {
            setError(
              requestError?.message ||
                'Não foi possível concluir a análise climática deste local. Tente novamente.',
            );
          }
        })
        .finally(() => {
          if (isActive) setIsLoading(false);
        });
    }, REQUEST_DEBOUNCE_MS);

    return () => {
      // Esta limpeza evita que um resultado antigo apareça sobre uma seleção nova.
      isActive = false;
      window.clearTimeout(requestTimer);
      controller.abort();
    };
  }, [selectedLocation]);

  // Peço a localização do navegador somente depois do clique do usuário.
  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setGeolocationError('Seu navegador não oferece geolocalização. Selecione o ponto no mapa.');
      return;
    }

    setIsLocating(true);
    setGeolocationError('');
    const requestId = geolocationRequestIdRef.current + 1;
    geolocationRequestIdRef.current = requestId;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        // Ignoro a resposta se outra escolha já aconteceu durante a espera.
        if (requestId !== geolocationRequestIdRef.current) return;
        const location = { lat: coords.latitude, lng: coords.longitude };
        selectLocation(location);
        mapRef.current?.flyTo([location.lat, location.lng], 11);
      },
      () => {
        if (requestId !== geolocationRequestIdRef.current) return;
        setGeolocationError(
          'Não foi possível acessar sua localização. Autorize o navegador ou selecione o ponto no mapa.',
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true, maximumAge: 300000, timeout: 10000 },
    );
  };

  // Esta alternativa permite selecionar o local pelo teclado ou colar coordenadas.
  const selectTypedCoordinates = (event) => {
    event.preventDefault();
    const latitude = Number(coordinateDraft.latitude.replace(',', '.'));
    const longitude = Number(coordinateDraft.longitude.replace(',', '.'));

    try {
      validateCoordinates(latitude, longitude);
      selectLocation({ lat: latitude, lng: longitude });
      mapRef.current?.flyTo([latitude, longitude], 11);
    } catch (coordinateError) {
      setGeolocationError(coordinateError.message);
    }
  };

  return (
    <div className="info-card climate-location-card fade-in">
      {/* Primeiro eu explico como selecionar o local e ofereço o botão de GPS. */}
      <div className="climate-card-heading">
        <span className="climate-card-icon" aria-hidden="true">📍</span>
        <div>
          <span className="climate-card-eyebrow">Pré-análise da propriedade</span>
          <h3>Localização e características climáticas</h3>
          <p>
            Clique no mapa, arraste o marcador ou informe as coordenadas para
            indicar a posição aproximada da propriedade.
          </p>
        </div>
      </div>

      {/* Este aviso explica por que a posição da propriedade é necessária. */}
      <div className="climate-purpose" role="note">
        <i className="bi bi-info-circle-fill" aria-hidden="true"></i>
        <p>
          <strong>Por que selecionar a propriedade no mapa?</strong>
          A posição permite relacionar o clima da região — como temperatura,
          umidade e radiação solar — às características físicas da propriedade
          informadas durante o atendimento. Esse conjunto de dados apoia a
          pré-análise do seu crédito e orienta os próximos passos.
        </p>
      </div>

      <button
        type="button"
        className="location-button"
        onClick={useMyLocation}
        disabled={isLocating}
      >
        <i className="bi bi-crosshair" aria-hidden="true"></i>
        {isLocating ? 'Localizando…' : 'Usar localização do dispositivo'}
      </button>

      {geolocationError && (
        <p className="climate-inline-error" role="alert">{geolocationError}</p>
      )}

      {/* Esta div vazia é o recipiente em que o Leaflet desenha o mapa. */}
      <div
        ref={mapElementRef}
        className="climate-map"
        data-testid="climate-map"
        role="region"
        aria-label="Mapa para selecionar a localização da propriedade"
      ></div>

      <p className="map-help">
        <i className="bi bi-arrows-move" aria-hidden="true"></i>
        Você também pode arrastar o marcador para ajustar o ponto.
      </p>

      {/* O formulário torna a seleção também acessível sem usar o mouse. */}
      <form className="coordinate-form" onSubmit={selectTypedCoordinates}>
        <label htmlFor="property-latitude">
          Latitude
          <input
            id="property-latitude"
            type="text"
            inputMode="decimal"
            placeholder="Ex.: -21,1775"
            required
            value={coordinateDraft.latitude}
            onChange={(event) =>
              setCoordinateDraft((draft) => ({
                ...draft,
                latitude: event.target.value,
              }))
            }
          />
        </label>
        <label htmlFor="property-longitude">
          Longitude
          <input
            id="property-longitude"
            type="text"
            inputMode="decimal"
            placeholder="Ex.: -47,8103"
            required
            value={coordinateDraft.longitude}
            onChange={(event) =>
              setCoordinateDraft((draft) => ({
                ...draft,
                longitude: event.target.value,
              }))
            }
          />
        </label>
        <button type="submit">Selecionar coordenadas</button>
      </form>

      {selectedLocation && (
        <p className="selected-coordinates" data-testid="selected-coordinates">
          Latitude: {formatNumber(selectedLocation.lat, 5)} · Longitude: {' '}
          {formatNumber(selectedLocation.lng, 5)}
        </p>
      )}

      {/* aria-live anuncia carregamento, erro ou resultado quando eles mudam. */}
      <div className="climate-feedback" aria-live="polite">
        {isLoading && (
          <div className="climate-loading" role="status">
            <span className="climate-spinner" aria-hidden="true"></span>
            Consultando condições atuais e histórico climático…
          </div>
        )}

        {error && !isLoading && (
          <div className="climate-error" role="alert" data-testid="climate-error">
            <strong>Análise não concluída</strong>
            <p>{error}</p>
            <small>Selecione novamente o ponto para tentar outra consulta.</small>
          </div>
        )}

        {result && !isLoading && (
          <div className="climate-result" data-testid="climate-result">
            {/* As condições atuais ajudam o usuário a reconhecer o clima do momento. */}
            <div className="climate-result-section">
              <h4>Condições atuais</h4>
              <div className="climate-metrics-grid">
                <Metric
                  icon="🌡️"
                  label="Temperatura"
                  value={formatNumber(result.current.temperature)}
                  unit="°C"
                />
                <Metric
                  icon="💧"
                  label="Umidade relativa"
                  value={formatNumber(result.current.humidity, 0)}
                  unit="%"
                />
                <Metric
                  icon="☀️"
                  label="Radiação solar"
                  value={formatNumber(result.current.radiation, 0)}
                  unit="W/m²"
                />
              </div>
            </div>

            {/* Estas são as médias dos dias históricos completos aceitos pelo cálculo. */}
            <div className="climate-result-section historical-section">
              <h4>Média anual recente (últimos 12 meses)</h4>
              <p className="historical-period">
                {formatDate(result.historical.periodStart)} a {' '}
                {formatDate(result.historical.periodEnd)} · {' '}
                {result.historical.validDays} dias válidos
              </p>
              <div className="climate-metrics-grid historical-metrics">
                <Metric
                  icon="🌡️"
                  label="Temperatura média"
                  value={formatNumber(result.historical.temperatureMean)}
                  unit="°C"
                />
                <Metric
                  icon="💧"
                  label="Umidade média"
                  value={formatNumber(result.historical.humidityMean)}
                  unit="%"
                />
                <Metric
                  icon="☀️"
                  label="Radiação média"
                  value={formatNumber(result.historical.radiationMean)}
                  unit="MJ/m²/dia"
                />
              </div>
            </div>

            {/* Aqui eu mostro, separadamente, cada comparação feita pela regra. */}
            <div className="climate-result-section criteria-section">
              <h4>Triagem climática demonstrativa</h4>
              <ul className="climate-criteria">
                <CriteriaRow
                  label={CLIMATE_CRITERIA.temperature.label}
                  expected={CLIMATE_CRITERIA.temperature.rangeLabel}
                  actual={`${formatNumber(result.historical.temperatureMean)} °C`}
                  passed={result.assessment.checks.temperature}
                />
                <CriteriaRow
                  label={CLIMATE_CRITERIA.humidity.label}
                  expected={CLIMATE_CRITERIA.humidity.rangeLabel}
                  actual={`${formatNumber(result.historical.humidityMean)}%`}
                  passed={result.assessment.checks.humidity}
                />
                <CriteriaRow
                  label={CLIMATE_CRITERIA.radiation.label}
                  expected={CLIMATE_CRITERIA.radiation.rangeLabel}
                  actual={`${formatNumber(result.historical.radiationMean)} MJ/m²/dia`}
                  passed={result.assessment.checks.radiation}
                />
              </ul>
            </div>

            {/* Este aviso evita tratar a demonstração como laudo ou decisão financeira. */}
            <p className="climate-disclaimer">
              Esta triagem usa referências acadêmicas indicativas para soja e
              tomate. Ela não determina aptidão agrícola nem, sozinha, a
              concessão de crédito.
            </p>

            {/* Se o histórico veio da contingência, explico por que não há aprovação. */}
            {result.assessment.dataQualityReview && (
              <p className="climate-provider-warning" role="status">
                O histórico principal estava temporariamente indisponível. Os
                indicadores foram recuperados da NASA POWER, mas, por
                segurança, esta consulta exige análise complementar e não gera
                pré-aprovação automática.
              </p>
            )}

            {/* A mensagem final usa exatamente o texto exigido no enunciado. */}
            <div
              className={`credit-message ${
                result.assessment.suitable ? 'credit-approved' : 'credit-review'
              }`}
              role="status"
              data-testid="credit-message"
            >
              <strong>{result.assessment.suitable ? 'Pré-análise positiva' : 'Análise complementar'}</strong>
              <p>{result.assessment.message}</p>
            </div>

            {/* No final eu mostro as fontes utilizadas e as limitações dos dados. */}
            <p className="climate-source">
              Condições atuais: {' '}
              <a
                href="https://open-meteo.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open-Meteo
              </a>
              . Histórico: {' '}
              <a
                href={result.historical.providerUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {result.historical.provider}
              </a>
              . Os dados são modelados e não substituem sensor local, análise
              agronômica, ZARC, vistoria da propriedade ou análise financeira
              completa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

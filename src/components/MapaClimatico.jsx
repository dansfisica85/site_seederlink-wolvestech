import React, { useCallback, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  CLIMATE_CRITERIA,
  fetchClimateForLocation,
  validateCoordinates,
} from '../lib/climate';

const INITIAL_POSITION = [-23.5505, -46.6333];
const REQUEST_DEBOUNCE_MS = 450;

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

function formatNumber(value, digits = 1) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function formatDate(isoDate) {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(
    new Date(`${isoDate}T12:00:00Z`),
  );
}

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

export default function MapaClimatico() {
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const selectLocationRef = useRef(null);
  const geolocationRequestIdRef = useRef(0);
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

  const selectLocation = useCallback(({ lat, lng }) => {
    const normalizedLocation = {
      lat: Number(lat.toFixed(5)),
      lng: Number(lng.toFixed(5)),
    };

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

  selectLocationRef.current = selectLocation;

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) return undefined;

    const map = L.map(mapElementRef.current, {
      scrollWheelZoom: false,
      zoomControl: true,
    }).setView(INITIAL_POSITION, 5);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const handleMapClick = ({ latlng }) => {
      selectLocationRef.current?.(latlng);
    };

    map.on('click', handleMapClick);
    mapRef.current = map;

    const resizeObserver = new ResizeObserver(() => map.invalidateSize(false));
    resizeObserver.observe(mapElementRef.current);
    window.setTimeout(() => map.invalidateSize(false), 0);

    return () => {
      resizeObserver.disconnect();
      map.off('click', handleMapClick);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedLocation) return;

    if (!markerRef.current) {
      const marker = L.marker([selectedLocation.lat, selectedLocation.lng], {
        alt: 'Marcador da propriedade selecionada',
        draggable: true,
        icon: PROPERTY_MARKER_ICON,
        keyboard: true,
        title: 'Arraste para ajustar a localização',
      }).addTo(map);

      marker.on('dragend', () => {
        const { lat, lng } = marker.getLatLng();
        selectLocationRef.current?.({ lat, lng });
      });

      markerRef.current = marker;
    } else {
      markerRef.current.setLatLng([selectedLocation.lat, selectedLocation.lng]);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (!selectedLocation) return undefined;

    const controller = new AbortController();
    let isActive = true;

    setIsLoading(true);
    setResult(null);
    setError('');

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
      isActive = false;
      window.clearTimeout(requestTimer);
      controller.abort();
    };
  }, [selectedLocation]);

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
      <div className="climate-card-heading">
        <span className="climate-card-icon" aria-hidden="true">📍</span>
        <div>
          <h3>Localização e análise climática</h3>
          <p>
            Clique no mapa para posicionar o marcador da propriedade ou use sua
            localização atual.
          </p>
        </div>
      </div>

      <button
        type="button"
        className="location-button"
        onClick={useMyLocation}
        disabled={isLocating}
      >
        <i className="bi bi-crosshair" aria-hidden="true"></i>
        {isLocating ? 'Localizando…' : 'Usar minha localização'}
      </button>

      {geolocationError && (
        <p className="climate-inline-error" role="alert">{geolocationError}</p>
      )}

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

            <p className="climate-disclaimer">
              Esta triagem usa referências acadêmicas indicativas para soja e
              tomate. Ela não determina aptidão agrícola nem, sozinha, a
              concessão de crédito.
            </p>

            {result.assessment.dataQualityReview && (
              <p className="climate-provider-warning" role="status">
                O histórico principal estava temporariamente indisponível. Os
                indicadores foram recuperados da NASA POWER, mas, por
                segurança, esta consulta exige análise complementar e não gera
                pré-aprovação automática.
              </p>
            )}

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

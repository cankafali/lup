/**
 * Klonu tazeleme isteği (§9.5): animasyon bitişleri, saat, ölçüm sonrası. Ayrı küçük modül:
 * çağıranlar lup kodunu ilk yüke çekmesin (lup hidrasyondan sonra gelir, K-103).
 * Lup kurulunca işleyicisini kaydeder; o zamana dek istek boşa gider (klon zaten henüz yok).
 */
let handler: () => void = () => {};

export function refreshLoupe() {
  handler();
}

export function setLoupeRefresh(fn: () => void) {
  handler = fn;
}

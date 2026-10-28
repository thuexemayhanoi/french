// Shared helpers: every scene draws AND returns the French description of what it drew.
const SCENES = {};
const TIME_FR = { dawn: 'à l’aube', morning: 'dans la lumière du matin', noon: 'en plein jour', golden: 'dans la lumière dorée de fin d’après-midi', dusk: 'au crépuscule', night: 'la nuit', overcast: 'sous un ciel couvert', rain: 'sous la pluie', mist: 'dans la brume' };
const BIKE_FR = {
  scooter_small: ['scooter automatique compact', 'm'], scooter_flat: ['scooter automatique à plancher plat', 'm'], scooter_sport: ['scooter automatique sportif', 'm'],
  scooter_premium: ['scooter automatique à grandes roues', 'm'], maxi: ['maxi-scooter à pare-brise', 'm'], electric: ['scooter électrique', 'm'],
  underbone: ['moto semi-automatique', 'f'], sport_underbone: ['moto semi-automatique sportive', 'f'], cub: ['moto néo-rétro de style cub', 'f'],
  cub_trail: ['moto cub tout-chemin à porte-bagages', 'f'], trail: ['moto trail à grandes roues', 'f'],
};
const COLOR_F = { blanc: 'blanche', noir: 'noire', gris: 'grise', vert: 'verte', bleu: 'bleue', argent: 'argentée' };
function colorWord(name, g) { if (name === 'argent') return g === 'f' ? 'argentée' : 'argenté'; return g === 'f' ? (COLOR_F[name] || name) : name; }
function bikeFR(b, art = 'indef') { const [n, g] = BIKE_FR[b.type]; const a = art === 'indef' ? (g === 'f' ? 'une ' : 'un ') : ''; return a + n + ' ' + colorWord(b.cname, g) + (b.model ? ' évoquant ' + (g === 'f' ? 'la ' : 'le ') + b.model : ''); }
function bikeShort(b) { const [n, g] = BIKE_FR[b.type]; return (g === 'f' ? 'une ' : 'un ') + n + ' ' + colorWord(b.cname, g); }
const OUTFITS = [{ top: '#d0663a', pants: '#2f3a4f', helmet: '#f2f2f2', fr: 'veste orange' }, { top: '#3d6fa8', pants: '#3b3b3b', helmet: '#e8c547', fr: 'veste bleue' }, { top: '#6b8e4e', pants: '#2f3a4f', helmet: '#2b2d31', fr: 'veste verte' }, { top: '#e6d9c2', pants: '#5a4a3a', helmet: '#c83a3a', fr: 'chemise claire' }, { top: '#8a3b4f', pants: '#2f3a4f', helmet: '#ffffff', fr: 'veste bordeaux' }, { top: '#2b2d31', pants: '#3b4a63', helmet: '#7fb3d9', fr: 'blouson sombre' }, { top: '#f0c24b', pants: '#2f3a4f', helmet: '#3a5f9a', fr: 'veste jaune' }];
function outfit(extra = {}) { return Object.assign({}, pick(OUTFITS), extra); }
function heroBike(b, x, gy, s, o = {}) { bike(x, gy, s, b.type, b.color, o); }
function sentence(s) { s = s.replace(/\s+/g, ' ').replace(/ ,/g, ',').trim(); return s.charAt(0).toUpperCase() + s.slice(1).replace(/\.$/, '') + '.'; }
function fe(sp, i = 0) { return BIKE_FR[sp.bikes[i % sp.bikes.length].type][1] === 'f' ? 'e' : ''; }

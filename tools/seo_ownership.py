#!/usr/bin/env python3
"""Build data/seo-query-ownership.json: one primary French query owner per intent (G05).

Usage: python3 tools/seo_ownership.py [--check]

Overlap groups below were decided after reading the candidate list produced by token
similarity of H1/title/keyword signals (same model set, Jaccard >= 0.45) and the model-pair
comparison clusters. Siblings keep their URL and content and get a distinct angle; no redirect,
noindex or canonical to another URL is introduced. Seeds are editorial, not search-volume data.
"""
import csv
import itertools
import json
import re
import sys
import unicodedata
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from seo_master import Page, clean, route, source_pages  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'data/seo-query-ownership.json'

ANGLE_OWNER = 'Comparatif général pour louer à Hanoi : usage urbain, confort, rangement, prise en main et tarifs indicatifs à confirmer.'
ANGLE_ROAD = 'Angle distinct : sorties hors de Hanoi, longues distances, passager et bagages (pas une seconde comparaison urbaine générale).'
ANGLE_HANDLING = 'Angle distinct : prise en main selon le profil du conducteur (débutant, gabarit, transmission, ergonomie), pas un comparatif général.'
ANGLE_COST = 'Angle distinct : coût à l’usage (carburant ou énergie, durée, budget), uniquement avec les tarifs indicatifs publiés et sans forfait inventé.'

GROUPS = [
    {'id': 'CMP-VISION-JANUS', 'query': 'honda vision ou yamaha janus location', 'owner': 'honda/honda-vision-ou-yamaha-janus-location/index.html',
     'angles': {'yamaha/yamaha-janus-125-ou-honda-vision-location/index.html': ANGLE_ROAD,
                'types-motos/honda-vision-ou-yamaha-janus-location/index.html': ANGLE_HANDLING,
                'prix-location/vision-ou-janus-cout-location-hanoi/index.html': ANGLE_COST}},
    {'id': 'CMP-AIRBLADE125-NVX', 'query': 'honda air blade 125 ou yamaha nvx', 'owner': 'honda/honda-air-blade-125-ou-yamaha-nvx-location/index.html',
     'angles': {'types-motos/yamaha-nvx-ou-honda-air-blade-location-vietnam/index.html': ANGLE_HANDLING,
                'prix-location/air-blade-ou-nvx-cout-location-hanoi/index.html': ANGLE_COST}},
    {'id': 'CMP-AIRBLADE160-NVX155', 'query': 'honda air blade 160 ou yamaha nvx 155', 'owner': 'honda/honda-air-blade-160-ou-yamaha-nvx-155-location/index.html',
     'angles': {'yamaha/yamaha-nvx-ou-honda-air-blade-160-location/index.html': ANGLE_ROAD}},
    {'id': 'CMP-LEAD-GRANDE', 'query': 'honda lead ou yamaha grande', 'owner': 'honda/honda-lead-abs-ou-yamaha-grande-location/index.html',
     'angles': {'yamaha/yamaha-grande-ou-honda-lead-abs-location/index.html': ANGLE_ROAD,
                'types-motos/honda-lead-ou-yamaha-grande-location/index.html': ANGLE_HANDLING}},
    {'id': 'CAT-SCOOTER-RANGEMENT', 'query': 'scooter grand coffre hanoi', 'owner': 'types-motos/scooter-grand-rangement-hanoi/index.html', 'angles': {}},
    {'id': 'CMP-VARIO-FREEGO', 'query': 'honda vario 125 ou yamaha freego', 'owner': 'honda/honda-vario-125-ou-yamaha-freego-location/index.html',
     'angles': {'yamaha/yamaha-freego-ou-honda-vario-125-location/index.html': ANGLE_ROAD}},
    {'id': 'CMP-SH125I-NMAX', 'query': 'honda sh125i ou yamaha nmax', 'owner': 'honda/honda-sh125i-ou-yamaha-nmax-location/index.html',
     'angles': {'yamaha/yamaha-nmax-ou-honda-sh125i-location/index.html': ANGLE_ROAD}},
    {'id': 'CMP-WAVEALPHA-SIRIUS', 'query': 'honda wave alpha ou yamaha sirius', 'owner': 'honda/honda-wave-alpha-110-ou-yamaha-sirius-location/index.html',
     'angles': {'yamaha/yamaha-sirius-ou-honda-wave-alpha-location/index.html': ANGLE_ROAD,
                'types-motos/wave-alpha-ou-sirius-location-vietnam/index.html': ANGLE_HANDLING,
                'prix-location/wave-ou-sirius-mensuelle-cout-location/index.html': ANGLE_COST}},
    {'id': 'CMP-WAVERSX-SIRIUSFI', 'query': 'honda wave rsx ou yamaha sirius fi', 'owner': 'honda/honda-wave-rsx-ou-yamaha-sirius-fi-location/index.html',
     'angles': {'yamaha/yamaha-sirius-fi-ou-honda-wave-rsx-location/index.html': ANGLE_ROAD}},
    {'id': 'CMP-FUTURE-JUPITERFINN', 'query': 'honda future ou yamaha jupiter finn', 'owner': 'honda/honda-future-125-fi-ou-yamaha-jupiter-finn-location/index.html',
     'angles': {'yamaha/yamaha-jupiter-finn-ou-honda-future-125-fi-location/index.html': ANGLE_ROAD,
                'types-motos/honda-future-ou-yamaha-jupiter-finn-location/index.html': ANGLE_HANDLING}},
    {'id': 'CMP-WINNERX-EXCITER', 'query': 'honda winner x ou yamaha exciter 155', 'owner': 'honda/honda-winner-x-ou-yamaha-exciter-155-location/index.html',
     'angles': {'yamaha/yamaha-exciter-155-ou-honda-winner-x-location/index.html': ANGLE_ROAD,
                'types-motos/winner-x-ou-exciter-155-location-vietnam/index.html': ANGLE_HANDLING}},
    {'id': 'CMP-CT125-WR155R', 'query': 'honda ct125 ou yamaha wr155r', 'owner': 'honda/honda-ct125-ou-yamaha-wr155r-location/index.html',
     'angles': {'yamaha/yamaha-wr155r-ou-honda-ct125-location/index.html': ANGLE_HANDLING,
                'types-motos/wr155r-ou-ct125-vietnam-voyage/index.html': 'Angle distinct : mauvaises routes, pistes et montagne du Nord (état des routes, pneus, charge), pas un comparatif général.'}},
    {'id': 'CMP-ICONE-NEOS', 'query': "honda icon e ou yamaha neo's", 'owner': 'honda/honda-icon-e-ou-yamaha-neo-s-location/index.html',
     'angles': {'yamaha/yamaha-neo-s-ou-honda-icon-e-location/index.html': 'Angle distinct : autonomie réelle, recharge et organisation au quotidien à Hanoi, pas un comparatif général.',
                'types-motos/honda-icon-e-ou-yamaha-neos-location-vietnam/index.html': ANGLE_HANDLING}},
    {'id': 'CMP-CUVE-NEOS', 'query': "honda cuv e ou yamaha neo's", 'owner': 'honda/honda-cuv-e-ou-yamaha-neo-s-location/index.html',
     'angles': {'types-motos/honda-cuv-e-ou-yamaha-neos-vietnam/index.html': 'Angle distinct : recharge et routine quotidienne (trajets, stationnement, batterie), pas un comparatif général.'}},
    {'id': 'TOPIC-DEPOT', 'query': 'dépôt caution location moto hanoi', 'owner': 'location-moto-hanoi/location-moto-depot-hanoi/index.html',
     'angles': {'location-moto-hanoi/passeport-depot-location-moto-hanoi/index.html': 'Angle distinct : comparer laisser un passeport et verser une garantie, risques et questions à poser ; aucune politique de la boutique affirmée.',
                'prix-location/location-moto-depot-hanoi-passeport/index.html': 'Angle distinct : effet de la garantie sur le budget (argent immobilisé, change, restitution) ; aucun montant inventé.',
                'prix-location/50cc-location-scooter-hanoi-prix/index.html': 'Angle distinct : le prix publié du 50cc et ce qu’il ne couvre pas ; garantie et conditions à confirmer.'}},
    {'id': 'TOPIC-PASSEPORT', 'query': 'laisser son passeport location moto hanoi', 'owner': 'location-moto-hanoi/passeport-location-moto-hanoi/index.html',
     'angles': {'permis-securite/passeport-location-moto-vietnam/index.html': 'Angle distinct : papiers d’identité à garder sur soi et démarches (hébergement, contrôles), pas la politique de garantie d’un loueur.'}},
    {'id': 'TOPIC-COURTE-DUREE', 'query': 'location moto courte durée hanoi', 'owner': 'location-moto-hanoi/courte-duree/index.html',
     'angles': {'location-moto-hanoi/courte-duree-location-moto-hanoi/index.html': 'Angle distinct : organiser 24, 48 ou 72 heures (horaires, comptage, programme), en renvoyant au guide courte durée.'}},
    {'id': 'TOPIC-LONGUE-DUREE', 'query': 'location moto longue durée hanoi', 'owner': 'location-moto-hanoi/longue-duree/index.html',
     'angles': {'location-moto-hanoi/longue-duree-location-moto-hanoi/index.html': 'Angle distinct : choisir la machine pour un long séjour (fiabilité, consommation, entretien), pas le guide général.',
                'prix-location/longue-duree-location-moto-hanoi-discount/index.html': 'Angle distinct : discuter le tarif d’une longue location sans remise ni forfait inventés.',
                'prix-location/mois/index.html': 'Angle distinct : le prix au mois (tableau des tarifs indicatifs mensuels).'}},
    {'id': 'TOPIC-ELEC-ESSENCE', 'query': 'scooter électrique ou essence hanoi', 'owner': 'types-motos/electrique-scooter-ou-essence-scooter-hanoi/index.html',
     'angles': {'prix-location/electrique-ou-essence-scooter-mensuelle-cout-hanoi/index.html': 'Angle distinct : budget total sur un mois de location.',
                'prix-location/electrique-scooter-recharge-cout-ou-essence-vietnam/index.html': 'Angle distinct : coût de l’énergie seul (recharge ou carburant), avec sources datées ou estimations qualitatives.'}},
    {'id': 'TOPIC-CONVERSION-PERMIS', 'query': 'convertir permis étranger vietnam', 'owner': 'permis-securite/conversion-permis-conduire-etranger-vietnam/index.html',
     'angles': {'permis-securite/touriste-conversion-permis-conduire-vietnam/index.html': 'Angle distinct : le cas du touriste en court séjour (réponse courte et alternatives), en renvoyant à la procédure de conversion.',
                'permis-securite/permis-conduire-etranger-valide-vietnam/index.html': 'Angle distinct : utiliser directement un permis étranger ou un permis international, sans conversion.'}},
    {'id': 'TOPIC-STREET-FOOD', 'query': 'street food hanoi moto', 'owner': 'hanoi/hanoi-street-food-itineraire-moto/index.html',
     'angles': {'hanoi/hanoi-food-itineraire-moto/index.html': 'Angle distinct : un circuit court de trois heures en soirée, en renvoyant au guide street food complet.'}},
    {'id': 'TOPIC-SIRIUS-ROADTRIP', 'query': 'yamaha sirius road trip vietnam', 'owner': 'yamaha/yamaha-sirius-vietnam-voyage-moto/index.html',
     'angles': {'yamaha/yamaha-sirius-fi-vietnam-voyage-moto/index.html': 'Angle distinct : ce que change l’injection du Sirius FI sur la route (altitude, démarrage, consommation, entretien).'}},
    {'id': 'TOPIC-LIVRAISON', 'query': 'livraison moto hôtel hanoi', 'owner': 'location-moto-hanoi/moto-livraison-hotel-hanoi/index.html',
     'angles': {'prix-location/moto-livraison-frais-hanoi/index.html': 'Angle distinct : frais éventuels de remise, à demander avant réservation ; aucun montant ni seuil inventé.'}},
    {'id': 'TOPIC-HA-GIANG', 'query': 'boucle ha giang moto', 'owner': 'nord-vietnam/ha-giang/index.html',
     'angles': {'nord-vietnam/ha-giang-boucle-voyage-moto/index.html': 'Angle distinct : guide de la première fois (permis, préparation, étapes types), en renvoyant au guide de la boucle.',
                'nord-vietnam/ha-giang-circuit-moto-prix/index.html': 'Angle distinct : budget du circuit poste par poste, sans forfait inventé.'}},
    {'id': 'TOPIC-SAPA', 'query': 'sapa à moto', 'owner': 'nord-vietnam/sapa/index.html',
     'angles': {'nord-vietnam/sapa-voyage-moto/index.html': 'Angle distinct : sur place (vallées, col d’Ô Quy Hồ, saisons), en renvoyant au guide de la route depuis Hanoi.'}},
    {'id': 'TOPIC-NINH-BINH', 'query': 'ninh binh à moto depuis hanoi', 'owner': 'nord-vietnam/ninh-binh/index.html',
     'angles': {'nord-vietnam/ninh-binh-voyage-moto/index.html': 'Angle distinct : boucles sur place entre karsts et rizières, en renvoyant au guide principal.'}},
    {'id': 'TOPIC-PRIX', 'query': 'prix location moto hanoi', 'owner': 'prix-location/index.html',
     'angles': {'prix-location/prix-location-moto-hanoi/index.html': 'Angle distinct : lire et comparer une offre de location, en renvoyant au tableau des tarifs.'}},
    {'id': 'TOPIC-CAT-BA', 'query': 'cat ba moto', 'owner': 'nord-vietnam/cat-ba-voyage-moto/index.html',
     'angles': {'nord-vietnam/hanoi-a-cat-ba-moto/index.html': 'Angle distinct : le trajet depuis Hanoi et les traversées, en renvoyant au guide de l’île.'}},
]

SUFFIX = {ANGLE_ROAD: 'longue distance et duo', ANGLE_HANDLING: 'prise en main', ANGLE_COST: 'coût'}
ANGLE_QUERY = {
    'types-motos/wr155r-ou-ct125-vietnam-voyage/index.html': 'mauvaises routes',
    'yamaha/yamaha-neo-s-ou-honda-icon-e-location/index.html': 'autonomie recharge',
    'types-motos/honda-cuv-e-ou-yamaha-neos-vietnam/index.html': 'recharge quotidien',
    'location-moto-hanoi/passeport-depot-location-moto-hanoi/index.html': 'passeport ou garantie',
    'prix-location/location-moto-depot-hanoi-passeport/index.html': 'budget',
    'prix-location/50cc-location-scooter-hanoi-prix/index.html': '50cc prix',
    'permis-securite/passeport-location-moto-vietnam/index.html': 'papiers à garder',
    'location-moto-hanoi/courte-duree-location-moto-hanoi/index.html': '24 48 72 heures',
    'location-moto-hanoi/longue-duree-location-moto-hanoi/index.html': 'quelle machine',
    'prix-location/longue-duree-location-moto-hanoi-discount/index.html': 'négocier',
    'prix-location/mois/index.html': 'prix au mois',
    'prix-location/electrique-ou-essence-scooter-mensuelle-cout-hanoi/index.html': 'budget mensuel',
    'prix-location/electrique-scooter-recharge-cout-ou-essence-vietnam/index.html': 'coût énergie',
    'permis-securite/touriste-conversion-permis-conduire-vietnam/index.html': 'touriste',
    'permis-securite/permis-conduire-etranger-valide-vietnam/index.html': 'sans conversion permis international',
    'hanoi/hanoi-food-itineraire-moto/index.html': 'circuit 3 heures soir',
    'yamaha/yamaha-sirius-fi-vietnam-voyage-moto/index.html': 'sirius fi injection',
    'prix-location/moto-livraison-frais-hanoi/index.html': 'frais',
    'nord-vietnam/hanoi-a-cat-ba-moto/index.html': 'depuis hanoi traversées',
    'nord-vietnam/ha-giang-boucle-voyage-moto/index.html': 'première fois',
    'nord-vietnam/ha-giang-circuit-moto-prix/index.html': 'budget',
    'nord-vietnam/sapa-voyage-moto/index.html': 'sur place vallées col',
    'nord-vietnam/ninh-binh-voyage-moto/index.html': 'boucles sur place',
    'prix-location/prix-location-moto-hanoi/index.html': 'lire une offre',
}

STOP = set('le la les de du des un une et a au aux en pour par sur avec ou que qui quoi quel quelle quels quelles est sont son sa ses vos '
           'votre vous on ce cette ces d l s n y comment pourquoi faut il ne pas plus moins tout tous bien guide location louer moto motos '
           'scooter scooters hanoi vietnam lequel laquelle choisir faire savoir avant apres jour peut se quand entre'.split())


def norm(text):
    text = unicodedata.normalize('NFKD', text.lower())
    return ''.join(c for c in text if not unicodedata.combining(c)).replace('’', "'")


def tokens(text):
    return {t for t in re.findall(r'[a-z0-9]+', norm(text)) if t not in STOP and len(t) > 1}


def seed_from_h1(h1):
    seed = re.sub(r'[?!«»"“”]', '', h1.replace(' : ', ' ').replace(' — ', ' ')).strip()
    return seed[0].lower() + seed[1:] if seed else h1


def build():
    policy = json.loads((ROOT / 'data/seo-master-policy.json').read_text())
    cluster = {p['path']: p for p in json.loads((ROOT / 'data/seo-cluster-matrix.json').read_text())['pages']}
    with (ROOT / 'data/content-matrix.csv').open(newline='') as fh:
        articles = {r['path']: r for r in csv.DictReader(fh) if r['path']}
    pages = {}
    for path in source_pages():
        rel = path.relative_to(ROOT).as_posix()
        page = Page(path.read_text())
        if page.body.get('data-page-type') == 'redirect':
            continue
        h1 = clean(' '.join(page.h1s[0])) if page.h1s else ''
        title = clean(' '.join(page.titles[0])) if page.titles else ''
        pages[rel] = {'h1': h1, 'title': title, 'toks': tokens(h1 + ' ' + title + ' ' + articles.get(rel, {}).get('keyword_signal', ''))}
    membership = {}
    for group in GROUPS:
        for rel in [group['owner'], *group['angles']]:
            if rel not in pages:
                raise SystemExit(f'{group["id"]}: unknown page {rel}')
            if rel in membership:
                raise SystemExit(f'{rel} in two groups')
            membership[rel] = group
    rows = []
    for rel, info in sorted(pages.items()):
        r = route(rel)
        override = policy['route_overrides'].get(r, {})
        fnd = cluster.get(r, {})
        art = articles.get(rel)
        group = membership.get(rel)
        if group and group['owner'] == rel:
            role, angle, query = 'OWNER', ANGLE_OWNER if group['id'].startswith('CMP-') else 'Propriétaire de la requête du groupe.', group['query']
        elif group:
            role, angle = 'DISTINCT_ANGLE', group['angles'][rel]
            query = group['query'] + ' ' + SUFFIX.get(angle, ANGLE_QUERY.get(rel, seed_from_h1(info['h1'])))
        else:
            role, angle = 'OWNER', ''
            query = override.get('keyword_seed_fr') or fnd.get('primary_keyword') or seed_from_h1(info['h1'])
        sims = sorted(((len(info['toks'] & o['toks']) / len(info['toks'] | o['toks']) if info['toks'] | o['toks'] else 0, other)
                       for other, o in pages.items() if other != rel), reverse=True)[:3]
        rows.append({
            'path': rel, 'url': 'https://fr.rentbikehanoi.com' + r, 'type': 'ARTICLE' if art else ('HOME' if rel == 'index.html' else 'FOUNDATION'),
            'primary_query_fr': query, 'role': role, 'group': group['id'] if group else None,
            'group_owner': group['owner'] if group else rel, 'angle': angle,
            'parent_hub': art['parent_hub_path'] if art else override.get('parent_hub', '/'),
            'closest_pages': [{'path': o, 'similarity': round(s, 2)} for s, o in sims if s > 0],
        })
    return {'schema_version': 1, 'generated_for': 'G05 French query ownership; seeds are editorial, not volume or ranking data',
            'rules': ['Homepage owns the broad commercial query « location moto hanoi »; /location-moto-hanoi/ owns the step-by-step rental guide.',
                      'One preferred URL per intent inside the French site; siblings keep their URL and content with a distinct documented angle.',
                      'No redirect, noindex or cross-domain canonical is used to resolve overlap; no query is ceded to another owned domain.'],
            'groups': [{'id': g['id'], 'query': g['query'], 'owner': g['owner'], 'angles': g['angles']} for g in GROUPS],
            'pages': rows}


def main(argv):
    data = build()
    text = json.dumps(data, ensure_ascii=False, indent=1) + '\n'
    if argv and argv[0] == '--check':
        ok = OUT.exists() and OUT.read_text() == text
        print('ownership map current' if ok else 'ownership map stale: run python3 tools/seo_ownership.py')
        return 0 if ok else 1
    OUT.write_text(text)
    print(json.dumps({'pages': len(data['pages']), 'groups': len(data['groups']),
                      'distinct_angle_pages': sum(p['role'] == 'DISTINCT_ANGLE' for p in data['pages'])}, indent=1))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))

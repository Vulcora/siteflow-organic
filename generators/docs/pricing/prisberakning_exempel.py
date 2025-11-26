#!/usr/bin/env python3
"""
Siteflow Prisberäkningsexempel
Visar hur man använder prislistan programmatiskt
"""

import json

# Ladda prislistan
with open('siteflow-prislista.json', 'r', encoding='utf-8') as f:
    pricing = json.load(f)


def calculate_project_cost(hours, role, ownership_model='license'):
    """
    Beräkna projektkostnad baserat på timmar, roll och ägandemodell
    
    Args:
        hours: Antal timmar
        role: Rollens namn (t.ex. 'Elixir-utvecklare')
        ownership_model: 'license', 'shared', eller 'full'
    
    Returns:
        dict med kostnadsuppdelning
    """
    # Hitta timpris för roll
    hourly_rate = None
    for rate in pricing['hourly_rates']['rates']:
        if rate['role'] == role:
            hourly_rate = rate['price_per_hour']
            break
    
    if not hourly_rate:
        raise ValueError(f"Roll '{role}' hittades inte")
    
    # Beräkna baspris
    base_cost = hours * hourly_rate
    
    # Hitta ägandemodells multiplier
    multiplier = 1.0
    ownership_name = ownership_model
    
    ownership_mapping = {
        'license': 'Licensmodell',
        'shared': 'Delad äganderätt',
        'full': 'Full äganderätt'
    }
    
    for model in pricing['code_ownership']['models']:
        if model['name'] == ownership_mapping.get(ownership_model, ownership_model):
            multiplier = model['multiplier']
            ownership_name = model['name']
            break
    
    final_cost = base_cost * multiplier
    
    return {
        'role': role,
        'hours': hours,
        'hourly_rate': hourly_rate,
        'base_cost': base_cost,
        'ownership_model': ownership_name,
        'multiplier': multiplier,
        'final_cost': final_cost,
        'vat': final_cost * pricing['company']['vat_rate'],
        'total_with_vat': final_cost * (1 + pricing['company']['vat_rate'])
    }


def calculate_monthly_hosting(package_name):
    """
    Hämta månadskostnad för hosting-paket
    
    Args:
        package_name: Namnet på paketet (t.ex. 'Growth')
    
    Returns:
        dict med kostnadsuppdelning
    """
    for package in pricing['hosting']['packages']:
        if package['name'] == package_name:
            return {
                'package': package['name'],
                'specs': package['specs'],
                'costs': package['costs']
            }
    
    raise ValueError(f"Hosting-paket '{package_name}' hittades inte")


def find_packaged_service(service_name):
    """
    Hitta information om paketerad tjänst
    
    Args:
        service_name: Namnet på tjänsten
    
    Returns:
        dict med tjänsteinformation
    """
    for service in pricing['packaged_services']['services']:
        if service['name'] == service_name:
            return service
    
    raise ValueError(f"Tjänst '{service_name}' hittades inte")


def calculate_support_annual_cost(support_level):
    """
    Beräkna årskostnad för support
    
    Args:
        support_level: Supportnivå (t.ex. 'Standard Support')
    
    Returns:
        dict med kostnader
    """
    for package in pricing['support']['packages']:
        if package['name'] == support_level:
            monthly = package['price_monthly']
            return {
                'level': package['name'],
                'monthly': monthly,
                'annual': monthly * 12,
                'sla': package['sla_response_time'],
                'dev_hours_monthly': package.get('development_hours_monthly', 0)
            }
    
    raise ValueError(f"Supportnivå '{support_level}' hittades inte")


# ========== EXEMPEL PÅ ANVÄNDNING ==========

if __name__ == "__main__":
    print("=" * 60)
    print("SITEFLOW PRISBERÄKNINGSEXEMPEL")
    print("=" * 60)
    
    # Exempel 1: Beräkna projektkostnad
    print("\n1. PROJEKTKOSTNAD - 300 timmar Elixir-utveckling")
    print("-" * 60)
    
    for ownership in ['license', 'shared', 'full']:
        result = calculate_project_cost(
            hours=300,
            role='Elixir-utvecklare',
            ownership_model=ownership
        )
        print(f"\n{result['ownership_model']}:")
        print(f"  Baspris: {result['base_cost']:,} kr")
        print(f"  Multiplier: {result['multiplier']}x")
        print(f"  Slutpris: {result['final_cost']:,} kr")
        print(f"  Moms (25%): {result['vat']:,} kr")
        print(f"  Totalt inkl. moms: {result['total_with_vat']:,} kr")
    
    # Exempel 2: Hosting-kostnader
    print("\n\n2. HOSTING-KOSTNADER")
    print("-" * 60)
    
    for package_name in ['Starter', 'Growth', 'Scale', 'Enterprise']:
        hosting = calculate_monthly_hosting(package_name)
        print(f"\n{package_name}:")
        print(f"  Fly.io: {hosting['costs']['flyio_monthly']} kr/mån")
        print(f"  Siteflow förvaltning: {hosting['costs']['siteflow_management_monthly']} kr/mån")
        print(f"  Totalt: {hosting['costs']['total_monthly']} kr/mån")
        print(f"  Årskostnad: {hosting['costs']['total_monthly'] * 12:,} kr")
    
    # Exempel 3: Support-kostnader
    print("\n\n3. SUPPORT-KOSTNADER")
    print("-" * 60)
    
    for level in ['Basic Support', 'Standard Support', 'Premium Support']:
        support = calculate_support_annual_cost(level)
        print(f"\n{support['level']}:")
        print(f"  Månadskostnad: {support['monthly']:,} kr")
        print(f"  Årskostnad: {support['annual']:,} kr")
        print(f"  SLA: svar inom {support['sla']}")
        if support['dev_hours_monthly'] > 0:
            print(f"  Inkluderade utvecklingstimmar: {support['dev_hours_monthly']}h/mån")
    
    # Exempel 4: Paketerad tjänst
    print("\n\n4. PAKETERAD TJÄNST - MVP-SYSTEM")
    print("-" * 60)
    
    mvp = find_packaged_service('MVP-system')
    print(f"\nTjänst: {mvp['name']}")
    print(f"Prisintervall: {mvp['price_min']:,} - {mvp['price_max']:,} kr")
    print(f"Tidsåtgång: {mvp['duration']}")
    print("Omfattning:")
    for item in mvp['scope']:
        print(f"  • {item}")
    
    print("\nMed olika ägandemodeller (baserat på 300 000 kr):")
    base = 300000
    for model in pricing['code_ownership']['models']:
        if 'multiplier' in model:
            final = base * model['multiplier']
            print(f"  • {model['name']}: {final:,} kr")
    
    # Exempel 5: Komplett projektberäkning
    print("\n\n5. KOMPLETT PROJEKTEXEMPEL")
    print("-" * 60)
    print("\nProjekt: E-handelsplattform med Elixir")
    print("\nTeam och timmar:")
    
    project_costs = []
    
    # Senior arkitekt - 80 timmar
    arch_cost = calculate_project_cost(80, 'Senior Elixir-arkitekt', 'shared')
    project_costs.append(arch_cost)
    print(f"  • Senior Elixir-arkitekt: 80h × {arch_cost['hourly_rate']} kr = {arch_cost['base_cost']:,} kr")
    
    # Elixir-utvecklare - 400 timmar
    dev_cost = calculate_project_cost(400, 'Elixir-utvecklare', 'shared')
    project_costs.append(dev_cost)
    print(f"  • Elixir-utvecklare: 400h × {dev_cost['hourly_rate']} kr = {dev_cost['base_cost']:,} kr")
    
    # Frontend-utvecklare - 200 timmar
    fe_cost = calculate_project_cost(200, 'Frontend-utvecklare', 'shared')
    project_costs.append(fe_cost)
    print(f"  • Frontend-utvecklare: 200h × {fe_cost['hourly_rate']} kr = {fe_cost['base_cost']:,} kr")
    
    # DevOps - 40 timmar
    devops_cost = calculate_project_cost(40, 'DevOps-specialist', 'shared')
    project_costs.append(devops_cost)
    print(f"  • DevOps-specialist: 40h × {devops_cost['hourly_rate']} kr = {devops_cost['base_cost']:,} kr")
    
    total_base = sum(c['base_cost'] for c in project_costs)
    total_final = sum(c['final_cost'] for c in project_costs)
    total_vat = sum(c['vat'] for c in project_costs)
    
    print(f"\nBaspris: {total_base:,} kr")
    print(f"Ägandemodell: Delad äganderätt (1.3x)")
    print(f"Pris efter ägandemodell: {total_final:,} kr")
    print(f"Moms (25%): {total_vat:,} kr")
    print(f"\n🎯 TOTALT INKL. MOMS: {total_final + total_vat:,} kr")
    
    # Lägg till hosting och support
    hosting = calculate_monthly_hosting('Scale')
    support = calculate_support_annual_cost('Standard Support')
    
    print(f"\nMånatliga löpande kostnader:")
    print(f"  • Hosting (Scale): {hosting['costs']['total_monthly']:,} kr/mån")
    print(f"  • Support (Standard): {support['monthly']:,} kr/mån")
    print(f"  • Totalt löpande: {hosting['costs']['total_monthly'] + support['monthly']:,} kr/mån")
    print(f"  • Årskostnad löpande: {(hosting['costs']['total_monthly'] + support['monthly']) * 12:,} kr")
    
    print("\n" + "=" * 60)
    print("Alla priser är i SEK och exklusive moms där inget annat anges")
    print("=" * 60)

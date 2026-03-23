"""
Test script — analyzes all images in the uploads folder.
Usage:  python test_analyze.py
"""
import requests, glob, os, json, sys

UPLOADS = os.path.join(
    os.path.dirname(__file__),
    r"..\node-backend\uploads"          # adjust if needed
)
API = "http://localhost:8000/analyze"

exts = ("*.jpg", "*.jpeg", "*.png", "*.webp", "*.JPG", "*.PNG")
images = []
for e in exts:
    images += glob.glob(os.path.join(UPLOADS, e))

if not images:
    # Fallback: look in current folder
    for e in exts:
        images += glob.glob(e)

if not images:
    print("Nenhuma imagem encontrada.")
    print(f"Coloque imagens .jpg/.png em: {UPLOADS}")
    print("Ou rode o script da mesma pasta que as imagens.")
    sys.exit(1)

SEP = "=" * 60

for img_path in images:
    name = os.path.basename(img_path)
    print(f"\n{SEP}")
    print(f"  Analisando: {name}")
    print(SEP)

    with open(img_path, "rb") as f:
        r = requests.post(API, files={"image": f}, timeout=90)

    if r.status_code != 200:
        print(f"  ERRO {r.status_code}: {r.text[:300]}")
        continue

    d = r.json()

    p  = d.get("plant",       {})
    pr = d.get("problem",     {})
    sv = d.get("severity",    {})
    fi = d.get("financial",   {})
    ac = d.get("actions",     {})
    ir = d.get("irrigation",  {})
    en = d.get("environment", {})
    tr = d.get("trend",       {})
    h  = d.get("health",      {})
    sm = d.get("smart",       {})

    print(f"\n🌱 PLANTA")
    print(f"   Nome         : {p.get('commonName')} ({p.get('scientificName') or 'sem nome científico'})")
    print(f"   Estágio      : {p.get('growthStage')} — {'Normal ✓' if p.get('stageNormal') else 'Anormal ⚠'}")
    print(f"   Observação   : {p.get('stageObservation')}")

    print(f"\n🐛 PROBLEMA")
    if pr.get("hasProblem"):
        print(f"   Tipo         : {pr.get('problemType').upper()}")
        print(f"   Nome         : {pr.get('name')} ({pr.get('scientificName') or '—'})")
        print(f"   Contagioso   : {'Sim ⚠' if pr.get('isContagious') else 'Não'}")
        print(f"   Estágio      : {pr.get('stage')}")
        print(f"   Localização  : {pr.get('location')}")
        print(f"   Sintomas     :")
        for s in (pr.get("symptoms") or []):
            print(f"     • {s}")
    else:
        print("   Nenhum problema detectado ✅")

    sev = sv.get("severity", "low")
    sev_icon = {"high": "🔴", "medium": "🟡", "low": "🟢"}.get(sev, "⚪")
    print(f"\n📊 SEVERIDADE & URGÊNCIA")
    print(f"   Nível        : {sev_icon} {sev.upper()} (score: {sv.get('severityScore')}/100)")
    print(f"   Urgência     : {sv.get('urgency')} — {sv.get('urgencyDays')} dias")
    print(f"   Mensagem     : {sv.get('urgencyMessage')}")

    print(f"\n💸 IMPACTO FINANCEIRO")
    print(f"   Perda estim. : {fi.get('estimatedLossText')}")
    print(f"   ({fi.get('estimatedLossMin')}% – {fi.get('estimatedLossMax')}%)")
    print(f"   Emergência   : {'SIM 🚨' if fi.get('isEmergency') else 'Não'}")

    print(f"\n💊 PLANO DE AÇÃO")
    for a in (ac.get("immediateActions") or []):
        print(f"   🔴 AGORA : {a}")
    for a in (ac.get("shortTermActions") or []):
        print(f"   🟡 1-3d  : {a}")
    for a in (ac.get("preventiveActions") or []):
        print(f"   🟢 Prev. : {a}")
    if ac.get("specificProduct"):
        print(f"   💊 Produto: {ac.get('specificProduct')}")

    print(f"\n💧 IRRIGAÇÃO")
    print(f"   Necessária   : {'Sim' if ir.get('needed') else 'Não'}")
    print(f"   Excesso      : {'Sim ⚠' if ir.get('excess') else 'Não'}")
    print(f"   Solo         : {ir.get('soilStatus')}")
    print(f"   Conselho     : {ir.get('advice')}")

    print(f"\n🌡 AMBIENTE")
    print(f"   Temperatura  : {en.get('temperatureStatus')}")
    print(f"   Umidade      : {en.get('humidityStatus')}")
    print(f"   Luz          : {en.get('lightStatus')}")
    print(f"   Observação   : {en.get('observation')}")

    print(f"\n📈 TENDÊNCIA & PREVISÃO")
    print(f"   Vai piorar   : {'Sim ⚠' if tr.get('willWorsen') else 'Não'}")
    print(f"   Auto-recover : {'Sim' if tr.get('willSelfRecover') else 'Não'}")
    print(f"   Risco spread : {tr.get('spreadRisk')}")
    print(f"   Monitorar    : {tr.get('monitoringFrequency')}")
    print(f"   Previsão     : {tr.get('forecast')}")

    score = h.get("healthScore", 100)
    bar   = "█" * (score // 10) + "░" * (10 - score // 10)
    print(f"\n🌿 SAÚDE GERAL")
    print(f"   Score        : {score}/100  [{bar}]")
    print(f"   Status       : {h.get('healthStatus').upper()}")
    print(f"   Confiança    : {round(h.get('confidence',0)*100)}%")
    print(f"   Alerta       : {h.get('alertType')}")

    print(f"\n🧠 RECOMENDAÇÕES INTELIGENTES")
    print(f"   Melhor hora  : {sm.get('bestTimeToApply')}")
    print(f"   Monitoramento: {sm.get('monitoringSchedule')}")
    print(f"   Estratégia   : {sm.get('controlStrategy')}")
    for t in (sm.get("additionalTips") or []):
        print(f"   💡 {t}")

    print(f"\n🚨 RESUMO EM UMA LINHA")
    print(f"   {d.get('oneLiner')}")
    print(f"   Risco geral  : {d.get('riskLevel', '—').upper()}")

print(f"\n{SEP}")
print("  Análise concluída.")
print(SEP)

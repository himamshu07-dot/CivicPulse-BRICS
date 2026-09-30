"""
Script to generate the updated CIVICPULSE-BRICS.pdf presentation
using ReportLab canvas with 16:9 widescreen layout (960 x 540 pt),
matching the dark cyber aesthetic, typography, and card layouts.
"""
import os
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas

def build_pdf(output_path="../CIVICPULSE-BRICS.pdf"):
    width, height = 960, 540
    c = canvas.Canvas(output_path, pagesize=(width, height))

    # Color Palette
    BG_COLOR = HexColor("#0A0A0E")
    CARD_BG = HexColor("#14161D")
    CARD_BORDER = HexColor("#252A36")
    ACCENT_LIME = HexColor("#A3E635")
    ACCENT_RED = HexColor("#EF4444")
    TEXT_WHITE = HexColor("#FFFFFF")
    TEXT_MUTED = HexColor("#9CA3AF")
    TEXT_DARK = HexColor("#0A0A0E")
    CARD_HL_BG = HexColor("#19222E")

    def draw_bg():
        c.setFillColor(BG_COLOR)
        c.rect(0, 0, width, height, stroke=0, fill=1)

    def draw_card(x, y, w, h, bg=CARD_BG, border=CARD_BORDER, r=8):
        c.setFillColor(bg)
        if border:
            c.setStrokeColor(border)
            c.setLineWidth(1)
            c.roundRect(x, y, w, h, r, stroke=1, fill=1)
        else:
            c.roundRect(x, y, w, h, r, stroke=0, fill=1)

    def draw_header(tag, title):
        c.setFillColor(ACCENT_LIME)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(50, 495, tag.upper())
        c.setFillColor(TEXT_WHITE)
        c.setFont("Helvetica-Bold", 24)
        c.drawString(50, 460, title)

    # ==========================================
    # SLIDE 1: TITLE SLIDE
    # ==========================================
    draw_bg()
    if os.path.exists("page1_img_0.png"):
        c.drawImage("page1_img_0.png", 0, 0, width=width, height=height)
        # Subtle dark tint over image for text legibility
        c.setFillColor(HexColor("#06080E"))
        c.setFillAlpha(0.55)
        c.rect(0, 0, width, height, stroke=0, fill=1)
        c.setFillAlpha(1.0)

    # Category
    c.setFillColor(ACCENT_LIME)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, 480, "BUILD WITH AI · CODE FOR COMMUNITIES — SECOND EDITION")

    # Large Title
    c.setFillColor(TEXT_WHITE)
    c.setFont("Helvetica-Bold", 46)
    c.drawString(50, 370, "CIVICPULSE")
    c.drawString(50, 318, "BRICS")

    # Subtitle
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, 260, "Scalable AI-Driven Infrastructure Prioritization for Digital Public Goods")
    c.setFont("Helvetica-Oblique", 12)
    c.setFillColor(TEXT_MUTED)
    c.drawString(50, 235, "“From Citizen Voices to Actionable Infrastructure Intelligence.”")

    # Right Card: Track & Team Info
    draw_card(580, 130, 330, 240, bg=HexColor("#10141C"), border=HexColor("#2C3545"), r=10)
    
    # Badge
    c.setFillColor(HexColor("#1E3014"))
    c.setStrokeColor(ACCENT_LIME)
    c.setLineWidth(1)
    c.roundRect(600, 320, 180, 28, 6, stroke=1, fill=1)
    c.setFillColor(ACCENT_LIME)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(620, 330, "TRACK: OPEN INNOVATION")

    # Team Text
    c.setFillColor(TEXT_WHITE)
    c.setFont("Helvetica", 11)
    c.drawString(600, 290, "Team: [Team Name] · Members: [Names + Roles]")

    # Green accent divider line
    c.setFillColor(ACCENT_LIME)
    c.rect(600, 265, 120, 2, stroke=0, fill=1)

    # UPDATED SUBTITLE
    c.setFillColor(TEXT_WHITE)
    c.setFont("Helvetica-Bold", 9.5)
    c.drawString(600, 230, "CITIZENS  ->  AI  ->  SECTOR HEALTH MATRIX")
    c.drawString(600, 212, "& TELEMETRY  ->  POLICYMAKERS")

    c.showPage()

    # ==========================================
    # SLIDE 2: THE PROBLEM
    # ==========================================
    draw_bg()
    c.setFillColor(TEXT_WHITE)
    c.setFont("Helvetica-Bold", 26)
    c.drawString(50, 470, "Fragmented citizen voices delay action")

    # Left Column: TODAY
    c.setFillColor(ACCENT_RED)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(50, 420, "TODAY")

    bullets = [
        "Voice, text, and messaging feedback is scattered across channels.",
        "Reports arrive in different languages and regional dialects.",
        "Unstructured reports are difficult to analyze and deduplicate at scale.",
        "Critical infrastructure hotspots stay hard to detect in real time."
    ]
    c.setFont("Helvetica", 11.5)
    c.setFillColor(TEXT_WHITE)
    y_pos = 380
    for b in bullets:
        c.drawString(50, y_pos, "•")
        # Text wrap
        c.drawString(65, y_pos, b)
        y_pos -= 36

    # Right Column: 1..4 stages
    stages = [
        "1.  Citizen Reports",
        "2.  Data Silos",
        "3.  Limited Visibility",
        "4.  Delayed Prioritization"
    ]
    c.setFont("Helvetica-Bold", 12.5)
    y_s = 420
    for s in stages:
        c.drawString(520, y_s, s)
        y_s -= 30

    # CORE GAP Card
    draw_card(520, 140, 390, 160, bg=HexColor("#14161E"), border=HexColor("#2E3342"), r=10)
    c.setFillColor(TEXT_MUTED)
    c.setFont("Helvetica-Bold", 10.5)
    c.drawString(545, 265, "CORE GAP")
    c.setFillColor(TEXT_WHITE)
    c.setFont("Helvetica-Bold", 17)
    c.drawString(545, 225, "Citizen feedback exists.")
    c.setFillColor(ACCENT_RED)
    c.drawString(545, 195, "Actionable intelligence doesn’t.")

    c.showPage()

    # ==========================================
    # SLIDE 3: THE SOLUTION
    # ==========================================
    draw_bg()
    draw_header("THE SOLUTION", "From feedback to action")
    c.setFont("Helvetica", 11.5)
    c.setFillColor(TEXT_MUTED)
    c.drawString(50, 435, "CivicPulse BRICS turns citizen reports into geospatially prioritized infrastructure intelligence.")

    # 5 steps in 2 columns
    steps = [
        ("REPORT", "Voice / Text / Custom Location & Auto-GPS", 50, 340),
        ("UNDERSTAND", "AI Transcription + Multilingual Translation", 500, 340),
        ("CLUSTER", "Geospatial Proximity Hotspots (10km DBSCAN)", 50, 245),
        ("PRIORITIZE", "Multi-Factor ML Priority Index (0–100 Scorer)", 500, 245),
        ("ACT", "AI Project Directives, Budgets & Policy Review", 50, 150),
    ]
    for title, desc, x, y in steps:
        draw_card(x, y, 410, 75, bg=CARD_BG, border=CARD_BORDER, r=8)
        c.setFillColor(ACCENT_LIME)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(x + 20, y + 46, title)
        c.setFillColor(TEXT_WHITE)
        c.setFont("Helvetica", 10)
        c.drawString(x + 20, y + 24, desc)

    # Bottom Green Banner
    c.setFillColor(ACCENT_LIME)
    c.roundRect(50, 50, 860, 55, 6, stroke=0, fill=1)
    c.setFillColor(TEXT_DARK)
    c.setFont("Helvetica-Bold", 13)
    c.drawCentredString(480, 72, "Don’t just collect complaints. Identify emerging infrastructure needs.")

    c.showPage()

    # ==========================================
    # SLIDE 4: THE PLATFORM
    # ==========================================
    draw_bg()
    draw_header("THE PLATFORM", "One platform. Five capabilities.")

    # Row 1: 3 cards
    row1 = [
        ("01  Citizen Portal", "Voice + Text + Custom Location\nInteractive GPS detection & BRICS country selector", 50),
        ("02  Multilingual AI", "Transcription + Translation\nAutomatic dialect synthesis & hazard classification", 350),
        ("03  Geo-Intelligence", "10km Proximity Clustering\nDBSCAN grouping of isolated infrastructure requests", 650),
    ]
    for title, desc, x in row1:
        draw_card(x, 260, 260, 160)
        c.setFillColor(TEXT_WHITE)
        c.setFont("Helvetica-Bold", 12)
        c.drawString(x + 18, 390, title)
        c.setFillColor(TEXT_MUTED)
        c.setFont("Helvetica", 9.5)
        lines = desc.split("\n")
        c.drawString(x + 18, 350, lines[0])
        c.drawString(x + 18, 332, lines[1])

    # Row 2: 2 cards (UPDATED CARD 05)
    row2 = [
        ("04  Priority Engine", "Volume + Outage Duration + Sector Deficit + Disruption Intensity\nCalculates unified 0–100 ML severity ranking across sectors", 50, 410, False),
        ("05  Policy Command Center", "Sector Health Matrix + Autonomous Radar + AI Directives\nInteractive radial dials, live threat sweep radar & policy review briefs", 500, 410, True),
    ]
    for title, desc, x, w, hl in row2:
        bg = CARD_HL_BG if hl else CARD_BG
        border = ACCENT_LIME if hl else CARD_BORDER
        draw_card(x, 60, w, 175, bg=bg, border=border)
        c.setFillColor(ACCENT_LIME if hl else TEXT_WHITE)
        c.setFont("Helvetica-Bold", 13)
        c.drawString(x + 22, 195, title)
        c.setFillColor(TEXT_WHITE if hl else TEXT_MUTED)
        c.setFont("Helvetica", 10)
        lines = desc.split("\n")
        c.drawString(x + 22, 155, lines[0])
        c.drawString(x + 22, 135, lines[1])

    c.showPage()

    # ==========================================
    # SLIDE 5: INTELLIGENCE PIPELINE
    # ==========================================
    draw_bg()
    draw_header("TECHNICAL CORE", "The CivicPulse intelligence pipeline")

    # 6 cards
    pipe = [
        ("01", "VOICE /\nTEXT", False),
        ("02", "GEMINI 2.5\nFLASH", False),
        ("03", "0–100 ML\nSEVERITY", False),
        ("04", "10KM\nDBSCAN", False),
        ("05", "PRIORITY\nINDEX", False),
        ("06", "AI POLICY\nBRIEF", True),
    ]
    card_w = 130
    gap = 16
    for i, (num, label, hl) in enumerate(pipe):
        x = 50 + i * (card_w + gap)
        bg = ACCENT_LIME if hl else CARD_BG
        border = ACCENT_LIME if hl else CARD_BORDER
        draw_card(x, 260, card_w, 150, bg=bg, border=border)
        
        c.setFillColor(TEXT_DARK if hl else ACCENT_LIME)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(x + 15, 380, num)
        
        if not hl:
            c.setFillColor(ACCENT_LIME)
            c.rect(x + 15, 368, 45, 1.5, stroke=0, fill=1)

        c.setFillColor(TEXT_DARK if hl else TEXT_WHITE)
        c.setFont("Helvetica-Bold", 10.5)
        lines = label.split("\n")
        c.drawString(x + 15, 330, lines[0])
        if len(lines) > 1:
            c.drawString(x + 15, 314, lines[1])

    # Summary card (UPDATED)
    draw_card(50, 70, 860, 160)
    c.setFillColor(TEXT_WHITE)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(75, 190, "Transcribe  ·  Translate  ·  Categorize  ·  0–100 Multi-Factor Severity Scorer  ·  Geospatial Clustering")
    
    c.setFillColor(ACCENT_LIME)
    c.setFont("Helvetica-Bold", 10.5)
    c.drawString(75, 150, "TECHNICAL CORE")
    
    c.setFillColor(TEXT_MUTED)
    c.setFont("Helvetica", 11)
    c.drawString(75, 125, "Gemini 2.5 Flash API  +  Scikit-Learn DBSCAN  +  Haversine Matrix  +  Zero-Setup SQLite / PostgreSQL")

    c.showPage()

    # ==========================================
    # SLIDE 6: DECISION SURFACE
    # ==========================================
    draw_bg()
    draw_header("DECISION SURFACE", "From data to decision")

    # Top 3 cards (UPDATED COL 1)
    cols = [
        ("SECTOR MATRIX & RADAR", "Real-time radial gauges for Water, Roads, Power, Sanitation & autonomous threat radar sweep.", 50),
        ("LIVE FEED & TELEMETRY", "Anonymized, AI-translated citizen requests with live institutional status tickers.", 350),
        ("AI POLICY DIRECTIVES", "Autonomous project solutions with actionable budgets, timelines, and policy review citations.", 650),
    ]
    for title, desc, x in cols:
        draw_card(x, 260, 260, 160)
        c.setFillColor(ACCENT_LIME)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(x + 16, 390, title)
        c.setFillColor(TEXT_WHITE)
        c.setFont("Helvetica", 9.5)
        # wrap lines
        words = desc.split(" ")
        l1, l2, l3 = words[:5], words[5:10], words[10:]
        c.drawString(x + 16, 350, " ".join(l1))
        c.drawString(x + 16, 334, " ".join(l2))
        if l3:
            c.drawString(x + 16, 318, " ".join(l3))

    # Bottom 4 steps
    ch_steps = [
        ("1", "50 Citizen Reports", 50, False),
        ("2", "1 Geographic Hotspot", 270, False),
        ("3", "1 Priority Project", 490, False),
        ("4", "Policy Action", 710, True),
    ]
    for num, lbl, x, hl in ch_steps:
        bg = ACCENT_LIME if hl else CARD_BG
        border = ACCENT_LIME if hl else CARD_BORDER
        draw_card(x, 70, 200, 150, bg=bg, border=border)
        c.setFillColor(TEXT_DARK if hl else ACCENT_LIME)
        c.setFont("Helvetica-Bold", 28)
        c.drawCentredString(x + 100, 155, num)
        c.setFillColor(TEXT_DARK if hl else TEXT_WHITE)
        c.setFont("Helvetica-Bold", 11)
        c.drawCentredString(x + 100, 115, lbl)

    c.showPage()

    # ==========================================
    # SLIDE 7: SYSTEM DESIGN
    # ==========================================
    draw_bg()
    draw_header("SYSTEM DESIGN", "Simple, scalable architecture")

    # 6 cards (UPDATED OUTPUT & DATA)
    grid = [
        ("INPUT", "Citizen Portal · Voice | Text | Custom Location | BRICS Nation Selector", 50, 270, False),
        ("API", "FastAPI (Async Python 3.11 Backend) + Next.js 14 App Router", 350, 270, False),
        ("AI", "Gemini 2.5 Flash · Multilingual NLU & Generative Project Solutions", 650, 270, False),
        ("DATA", "SQLite (Zero-Setup Engine) / PostgreSQL + PostGIS", 50, 120, False),
        ("INTELLIGENCE", "Scikit-Learn DBSCAN (10km Radius) + 0–100 ML Severity Scorer", 350, 120, False),
        ("OUTPUT", "Policymaker Command Center · Sector Health Matrix & Radar", 650, 120, True),
    ]
    for title, desc, x, y, hl in grid:
        bg = ACCENT_LIME if hl else CARD_BG
        border = ACCENT_LIME if hl else CARD_BORDER
        draw_card(x, y, 260, 125, bg=bg, border=border)
        c.setFillColor(TEXT_DARK if hl else ACCENT_LIME)
        c.setFont("Helvetica-Bold", 11.5)
        c.drawString(x + 16, y + 92, title)
        c.setFillColor(TEXT_DARK if hl else TEXT_WHITE)
        c.setFont("Helvetica", 9)
        words = desc.split(" ")
        c.drawString(x + 16, y + 62, " ".join(words[:5]))
        c.drawString(x + 16, y + 46, " ".join(words[5:]))

    # Footer
    c.setFillColor(TEXT_MUTED)
    c.setFont("Helvetica", 9.5)
    c.drawCentredString(480, 50, "Supporting technologies: Tailwind CSS  ·  Lucide Icons  ·  Canvas Threat Radar  ·  Interactive SVG Dials  ·  REST APIs")

    c.showPage()

    # ==========================================
    # SLIDE 8: PRODUCTION-READY BY DESIGN
    # ==========================================
    draw_bg()
    draw_header("PRODUCTION-READY BY DESIGN", "Built for real-world civic systems")

    # 4 cards
    p_cards = [
        ("PRIVACY", "PII sanitization & anonymization before persistence", 50),
        ("SECURITY", "JWT + HTTP-only cookies & input schema validation", 270),
        ("ACCESS CONTROL", "RBAC: SuperAdmin | Policymaker | Analyst | Citizen", 490),
        ("SCALABILITY", "Local ward -> Regional -> National -> BRICS-scale", 710),
    ]
    for title, desc, x in p_cards:
        draw_card(x, 180, 200, 220)
        c.setFillColor(ACCENT_LIME)
        c.setFont("Helvetica-Bold", 11.5)
        c.drawString(x + 16, 365, title)
        c.setFillColor(TEXT_WHITE)
        c.setFont("Helvetica", 9.5)
        words = desc.split(" ")
        c.drawString(x + 16, 320, " ".join(words[:4]))
        c.drawString(x + 16, 302, " ".join(words[4:]))

    # Success Banner
    c.setFillColor(ACCENT_LIME)
    c.roundRect(50, 60, 860, 80, 6, stroke=0, fill=1)
    c.setFillColor(TEXT_DARK)
    c.setFont("Helvetica-Bold", 10.5)
    c.drawCentredString(480, 112, "SUCCESS METRICS")
    c.setFont("Helvetica-Bold", 13.5)
    c.drawCentredString(480, 85, "Processing Time  ·  Cluster Quality  ·  Multi-Factor ML Accuracy  ·  PII Removal Effectiveness")

    c.showPage()

    # ==========================================
    # SLIDE 9: THE END-TO-END PROMISE
    # ==========================================
    draw_bg()
    draw_header("THE END-TO-END PROMISE", "One report -> one actionable decision")

    # Left Column: 8 steps
    c.setFont("Helvetica-Bold", 10.5)
    c.setFillColor(TEXT_WHITE)
    y_p9 = 390
    steps_9 = [
        "1.  Citizen Voice & Text Report",
        "2.  AI Multilingual Audio Synthesis",
        "3.  Automatic Translation & Hazard Tagging",
        "4.  PII Sanitization & Anonymization",
        "5.  Geospatial Clustering (10km DBSCAN)",
        "6.  0–100 Multi-Factor ML Severity Scoring",
        "7.  AI Project Recommendation with Budget",
        "8.  Sector Health Matrix & Policy Action"
    ]
    for s in steps_9:
        c.drawString(50, y_p9, s)
        y_p9 -= 36

    # Right Card: Real Example
    draw_card(480, 210, 430, 180)
    c.setFillColor(ACCENT_LIME)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(505, 360, "REAL-WORLD EXAMPLE")
    c.setFillColor(TEXT_WHITE)
    c.setFont("Helvetica", 10)
    c.drawString(505, 325, "“Pipeline rupture reported in Ward 4”")
    c.drawString(505, 305, "-> Hotspot detected (10km DBSCAN)")
    c.drawString(505, 285, "-> ML Severity 88/100 (Critical Hazard)")
    c.drawString(505, 265, "-> Project Brief auto-drafted with $85,000 budget & 4-day timeline")

    # Brand Box
    c.setFillColor(ACCENT_LIME)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(480, 150, "CIVICPULSE BRICS")
    c.setFillColor(TEXT_WHITE)
    c.setFont("Helvetica-Oblique", 11)
    c.drawString(480, 125, "“Turning Citizen Voices into Actionable Infrastructure Intelligence.”")
    c.setFillColor(TEXT_MUTED)
    c.setFont("Helvetica", 9.5)
    c.drawString(480, 95, "Build with AI: Code for Communities — Second Edition")
    c.drawString(480, 80, "Multilingual AI · Geospatial Intelligence · Digital Public Goods")

    c.showPage()

    # Save
    c.save()
    print(f"PDF deck built successfully at {output_path}")

if __name__ == "__main__":
    build_pdf()

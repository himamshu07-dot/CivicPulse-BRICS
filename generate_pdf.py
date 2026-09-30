import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)

def create_script_pdf():
    pdf_path = r"c:\Users\hp\Documents\GitHub\CivicPulse-BRICS\CivicPulse_Video_Demo_Script.pdf"
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    primary_color = colors.HexColor("#0F172A")
    accent_color = colors.HexColor("#059669")
    text_dark = colors.HexColor("#1E293B")
    bg_light = colors.HexColor("#F8FAFC")
    cue_color = colors.HexColor("#B91C1C")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=primary_color,
        alignment=1,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=accent_color,
        alignment=1,
        spaceAfter=12
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=primary_color,
        spaceBefore=10,
        spaceAfter=4
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=accent_color,
        spaceBefore=4,
        spaceAfter=2
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=text_dark,
        spaceAfter=4
    )

    cue_action_style = ParagraphStyle(
        'ActionCue',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=cue_color
    )

    spoken_style = ParagraphStyle(
        'SpokenText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=primary_color
    )

    note_style = ParagraphStyle(
        'DirectorNote',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#475569")
    )

    story = []

    # Title & Header
    story.append(Paragraph("CIVICPULSE BRICS — OFFICIAL VIDEO DEMO SCRIPT", title_style))
    story.append(Paragraph("Track 1: AI for Digital Public Infrastructure & Multilateral Governance<br/><b>Presenter Walkthrough & Click-by-Click Directing Guide (Female Presenter)</b>", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=accent_color, spaceAfter=8))

    # Preparation Box
    prep_html = (
        "<b>PRESENTER PRE-FLIGHT CHECKLIST (BEFORE PRESSING RECORD):</b><br/>"
        "• <b>Active Services</b>: Open <b>http://localhost:3000</b> in full-screen browser (1080p/4K). Backend running on port 8000.<br/>"
        "• <b>Clean Baseline</b>: If test records exist, click <b>'Clear All'</b> in the top header to start fresh.<br/>"
        "• <b>Microphone</b>: Enable browser microphone permission for localhost:3000.<br/>"
        "• <b>Presenter Tone</b>: Executive, articulate, confident, tech-forward, and enthusiastic. Speak at a measured conversational pace (~135 WPM).<br/>"
        "• <b>Cursor Movement</b>: Move cursor smoothly. Pause on key UI elements for 1.5 seconds to let viewers absorb the indicators."
    )
    prep_table = Table([[Paragraph(prep_html, body_style)]], colWidths=[540])
    prep_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F1F5F9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(prep_table)
    story.append(Spacer(1, 6))

    # Scenes Definition
    scenes = [
        {
            "num": "SCENE 1 (0:00 - 0:32)",
            "title": "Hook & The Governance Problem",
            "action": (
                "• Browser starts full-width on <b>http://localhost:3000</b>.<br/>"
                "• Point cursor at CivicPulse logo, then trace along the scrolling <b>LIVE TELEMETRY</b> ticker at the top.<br/>"
                "• Hover gently over the 4 KPI metric cards in the Problems Directory."
            ),
            "spoken": (
                "\"Hello everyone! Under Track 1 — AI for Digital Public Infrastructure and Governance, "
                "we are thrilled to present <b>CivicPulse</b>.<br/><br/>"
                "Across the emerging BRICS economies, municipal governments face a critical challenge: citizen feedback "
                "is deeply fragmented across hundreds of vernacular languages, audio memos, and social platforms.<br/><br/>"
                "Life-safety infrastructure emergencies—such as broken drinking water mains, ICU hospital blackouts, or "
                "flash flood transit stoppages—too often get buried under general inquiries, causing delayed response.<br/><br/>"
                "CivicPulse solves this. We have built an open-source <b>Digital Public Good</b> connecting citizens directly "
                "to policymakers through real-time multilingual speech recognition, auditable 4-factor ML severity scoring, "
                "and automated public good policy directives.\""
            ),
            "note": "Tone: Executive, clear, inspiring. Emphasize 'Digital Public Good' and 'ML severity scoring'."
        },
        {
            "num": "SCENE 2 (0:32 - 1:18)",
            "title": "Citizen Voice, BRICS Country & Custom Location Ingestion",
            "action": (
                "• Click the neon button <b>'[ + Report Problem ]'</b> in the top right.<br/>"
                "• In the modal, point to the BRICS Country dropdown (India selected).<br/>"
                "• Click <b>'Detect Current GPS'</b> OR type <i>'Ward 42, Rohini Sector 16, New Delhi'</i> into the location box.<br/>"
                "• Click the microphone OR click preset <b>'🇮🇳 India — Water Pipeline Rupture (Hindi)'</b>.<br/>"
                "• Point to the <b>'Live AI Inference Preview'</b> card lighting up below the text box."
            ),
            "spoken": (
                "\"Let’s experience this through the eyes of a citizen.<br/><br/>"
                "Citizens should never have to navigate complicated government portals or pre-selected location lists. "
                "In CivicPulse, they simply click <b>'Report Problem'</b>.<br/><br/>"
                "Citizens select their BRICS member nation, and they can either type their exact neighborhood street or click "
                "<b>'Detect Current GPS'</b> to bind their coordinates automatically.<br/><br/>"
                "Next, they dictate naturally in their mother tongue.<br/><br/>"
                "Watch this: A citizen in New Delhi speaks in Hindi: <i>'हमारे वार्ड में 4 दिनों से मुख्य पेयजल पाइपलाइन टूटी हुई है और अस्पताल में मरीज परेशान हैं।'</i><br/><br/>"
                "Immediately, notice our <b>Live AI Inference Preview</b>: it automatically transcribes the Hindi text, "
                "routes it to our Indic transformer, classifies the sector as <b>Water & Sanitation</b>, and assesses a "
                "critical urgency score in real time before even hitting the database.\""
            ),
            "note": "Tone: Dynamic and engaging. Pause for 1 second when the AI preview card lights up with detected language 'HI'."
        },
        {
            "num": "SCENE 3 (1:18 - 1:52)",
            "title": "Submission, Privacy Sanitization & Persistent SQLite Storage",
            "action": (
                "• Click the green button <b>'[ Submit Grievance ]'</b>.<br/>"
                "• Point to the animated green checkmark and verified digital receipt.<br/>"
                "• Click <b>'View on Dashboard'</b>.<br/>"
                "• Point cursor to the <b>'Database: [1 Report]'</b> counter in the top bar, then to the newly created problem card."
            ),
            "spoken": (
                "\"When submitted, our FastAPI backend sanitizes the complaint for zero-knowledge privacy, runs semantic deduplication, "
                "and commits it into our persistent SQLite DBMS.<br/><br/>"
                "The citizen immediately receives an authenticated digital tracking receipt.<br/><br/>"
                "Returning to our dashboard, observe that our <b>Database counter</b> has incremented in real time. Everything you see "
                "is backed by real, persistent data.<br/><br/>"
                "Furthermore, if dozens of nearby citizens report the same broken pipe, CivicPulse's <b>TF-IDF cosine similarity engine</b> "
                "automatically merges duplicate complaints within a 10-kilometer radius, incrementing a merged complaints badge to eliminate ticket fatigue.\""
            ),
            "note": "Tone: Reassuring and authoritative. Emphasize that there is zero fake mock data."
        },
        {
            "num": "SCENE 4 (1:52 - 2:30)",
            "title": "4-Factor ML Severity Scoring & AI Architecture Blueprint",
            "action": (
                "• On the problem card, point to the score <b>90.0 / 100</b> and the red <b>[CRITICAL]</b> badge.<br/>"
                "• Click <b>'View ML Model Scoring Factors'</b>. Hover across the 4 factor boxes.<br/>"
                "• Click <b>'[ AI Architecture ]'</b> in the top header. Trace the 6 pipeline stages and the formula matrix.<br/>"
                "• Close the blueprint modal."
            ),
            "spoken": (
                "\"How do policymakers know which issues require emergency capital? Through our transparent "
                "<b>Machine Learning Severity Score out of 100</b>.<br/><br/>"
                "When we click <b>'View ML Model Scoring Factors'</b>, we see the exact mathematical vectors driving this score:<br/>"
                "1. <b>Public Health & Hazard Risk (35%)</b>,<br/>"
                "2. <b>Outage Duration (25%)</b>,<br/>"
                "3. <b>Sector Vulnerability Weight (20%)</b>, and<br/>"
                "4. <b>Disruption Intensity (20%)</b>.<br/><br/>"
                "By clicking our <b>'AI Architecture'</b> blueprint in the header, ministers can inspect our auditable 6-stage pipeline—"
                "from PII sanitization to Indic transformers and deterministic formulas—guaranteeing 100% governance transparency.\""
            ),
            "note": "Tone: Analytical and commanding. Highlight the transparency of the mathematical model."
        },
        {
            "num": "SCENE 5 (2:30 - 2:55)",
            "title": "Sector Health Matrix & Autonomous Threat Radar",
            "action": (
                "• On the left sidebar, click the 2nd tab: <b>'Sector Health Matrix'</b>.<br/>"
                "• Hover over the 4 <b>SVG Radial Sector Gauges</b> (Water, Power, Healthcare, Transport).<br/>"
                "• Point to the <b>Autonomous Threat Radar Scanner</b> with its rotating green sweep and hazard blips.<br/>"
                "• Trace the 24-hour ingestion velocity curve and the 10 BRICS country telemetry cards."
            ),
            "spoken": (
                "\"Next, let’s navigate to the <b>Sector Health Matrix</b>.<br/><br/>"
                "This replaces cluttered geospatial map dots with clean institutional telemetry. Policymakers have access to dynamic "
                "<b>radial sector gauges</b> tracking water resilience, power stability, and hospital readiness.<br/><br/>"
                "Beside them, our <b>Autonomous Threat Radar</b> sweeps continuously across BRICS coordinates, visualizing hazard clusters "
                "the moment they are reported.<br/><br/>"
                "This gives government leaders an immediate, high-level operational picture across all member states.\""
            ),
            "note": "Tone: Visionary and impressive. Emphasize the institutional grade of the visual telemetry."
        },
        {
            "num": "SCENE 6 (2:55 - 3:20)",
            "title": "AI Project Directives, Interactive Fiscal Simulator & Conclusion",
            "action": (
                "• Click the 3rd sidebar tab: <b>'AI Project Directives'</b>.<br/>"
                "• Click <b>'Review Policy'</b> on the top synthesized project card.<br/>"
                "• In the modal, click <b>'Interactive Fiscal Allocation'</b> and drag the slider from 100% to 125%.<br/>"
                "• Click <b>'[ Ratify Policy Recommendation ]'</b> — point to the green <b>COMMITTED</b> banner.<br/>"
                "• Close modal and smile warmly into the camera for the closing line."
            ),
            "spoken": (
                "\"Finally, CivicPulse bridges citizen grievances directly into capital budget deployment.<br/><br/>"
                "In our <b>AI Project Directives</b> view, our clustering engine synthesizes localized complaint clusters into high-impact infrastructure initiatives.<br/><br/>"
                "When we open <b>'Review Policy'</b>, policymakers can use our <b>Interactive Fiscal Allocation Simulator</b> to adjust funding allocations in real time, "
                "see projected citizen beneficiaries, and ratify recommendations directly into the New Development Bank queue.<br/><br/>"
                "CivicPulse empowers BRICS nations to listen in any language, evaluate with machine learning, and act with decisive speed.<br/><br/>"
                "Thank you!\""
            ),
            "note": "Tone: Warm, confident, triumphant closing. Deliver the final line with poise and energy."
        }
    ]

    for sc in scenes:
        header_text = f"<b>{sc['num']} — {sc['title']}</b>"
        story.append(Paragraph(header_text, h1_style))

        table_data = [
            [
                Paragraph("<b>WHERE TO POINT & CLICK:</b>", h2_style),
                Paragraph(sc['action'], cue_action_style)
            ],
            [
                Paragraph("<b>EXACT SPOKEN SCRIPT:</b>", h2_style),
                Paragraph(sc['spoken'], spoken_style)
            ],
            [
                Paragraph("<b>DIRECTOR NOTE / DELIVERY:</b>", h2_style),
                Paragraph(sc['note'], note_style)
            ]
        ]

        t = Table(table_data, colWidths=[130, 410])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), bg_light),
            ('BOX', (0,0), (-1,-1), 0.8, colors.HexColor("#CBD5E1")),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
            ('PADDING', (0,0), (-1,-1), 5),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        story.append(t)
        story.append(Spacer(1, 6))

    doc.build(story)
    print("PDF successfully generated at:", pdf_path)

if __name__ == "__main__":
    create_script_pdf()

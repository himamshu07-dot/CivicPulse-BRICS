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
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    
    # Custom Styles
    primary_color = colors.HexColor("#1E293B")
    accent_color = colors.HexColor("#0F766E")
    text_dark = colors.HexColor("#0F172A")
    bg_light = colors.HexColor("#F8FAFC")
    amber_color = colors.HexColor("#D97706")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=primary_color,
        alignment=1, # Center
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=accent_color,
        alignment=1,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=primary_color,
        spaceBefore=12,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=accent_color,
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=text_dark,
        spaceAfter=6
    )

    cue_action_style = ParagraphStyle(
        'ActionCue',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#B91C1C")
    )

    spoken_style = ParagraphStyle(
        'SpokenText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=primary_color
    )

    note_style = ParagraphStyle(
        'DirectorNote',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#475569")
    )

    story = []

    # Title & Header
    story.append(Paragraph("CIVICPULSE — OFFICIAL VIDEO DEMO SCRIPT", title_style))
    story.append(Paragraph("Track 1: AI for Digital Public Infrastructure & Governance (BRICS Innovation Theme)<br/><b>Presenter Walkthrough & Click-by-Click Directing Guide</b>", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=accent_color, spaceAfter=12))

    # Preparation Box
    prep_html = (
        "<b>BEFORE YOU PRESS RECORD (PRE-FLIGHT CHECKLIST):</b><br/>"
        "1. <b>Start Servers</b>: Ensure Frontend is open at <b>http://localhost:3000</b> and FastAPI backend is active.<br/>"
        "2. <b>Clean Slate</b>: Click the red <b>'Reset / Clear All'</b> button in the top header so the problems table starts completely empty.<br/>"
        "3. <b>Microphone & Audio</b>: Make sure your browser has microphone permission enabled for localhost:3000.<br/>"
        "4. <b>Delivery Persona</b>: Professional, confident, clear, articulate, and welcoming tone. Speak at a measured, conversational pace."
    )
    prep_table = Table([[Paragraph(prep_html, body_style)]], colWidths=[530])
    prep_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F1F5F9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(prep_table)
    story.append(Spacer(1, 10))

    # Scenes Definition
    scenes = [
        {
            "num": "SCENE 1 (0:00 - 0:30)",
            "title": "Hook & The Governance Problem",
            "action": "• Screen starts full-width on <b>http://localhost:3000</b>.<br/>• Mouse cursor is idle at the center of the clean Problems Directory.<br/>• Do not click anything yet.",
            "spoken": (
                "\"Hello everyone. Under Track 1 — AI for Digital Public Infrastructure and Governance, "
                "we are proud to present <b>CivicPulse</b>.<br/><br/>"
                "Across BRICS nations, governments struggle to consolidate citizen feedback. Critical infrastructure "
                "complaints arrive fragmented across local languages, voice notes, and messaging channels. "
                "Urgent life-safety crises—such as contaminated municipal drinking water or hospital clinic blackouts—often get "
                "buried under general feedback, leading to misaligned public spending.<br/><br/>"
                "CivicPulse is an open-source Digital Public Good that bridges citizens directly to policymakers through "
                "real-time speech recognition, multilingual translation, semantic deduplication, and an ML-driven severity scoring model.\""
            ),
            "note": "Tone: Serious, confident, and articulate. Highlight the words 'Digital Public Good' and 'ML-driven severity score'."
        },
        {
            "num": "SCENE 2 (0:30 - 1:15)",
            "title": "Live Citizen Voice & Speech-to-Text Input",
            "action": "• Move mouse and click the <b>'+ Add Problem (Voice / Text)'</b> button in the top right.<br/>• The Citizen Voice Portal modal opens.<br/>• Click on the microphone button OR click the 1st Quick Preset: <b>'🇮🇳 New Delhi — Water Crisis (Hindi)'</b>.<br/>• Point mouse to the live text appearing.",
            "spoken": (
                "\"Let’s look at the citizen experience.<br/><br/>"
                "Citizens shouldn't have to fill out complicated government forms. With CivicPulse, they simply click '+ Add Problem' "
                "and speak naturally in their mother tongue.<br/><br/>"
                "Our platform uses browser-native speech recognition to transcribe real-time voice input across Hindi, Portuguese, Russian, "
                "Mandarin, and English.<br/><br/>"
                "Here, a resident in New Delhi reports an urgent failure in Hindi: <i>'हमारे वार्ड में 4 दिनों से मुख्य पेयजल पाइपलाइन टूटी हुई है और अस्पताल में मरीज परेशान हैं।'</i><br/><br/>"
                "Immediately, watch the <b>Live AI Processing Preview</b> below: it automatically detects the Hindi script, "
                "translates the statement into a unified English baseline, classifies the sector as <b>Water & Sanitation</b>, and "
                "flags an elevated urgency level in real time before submission.\""
            ),
            "note": "Tone: Excited and dynamic. Pause for 1 second when the AI preview card lights up in teal to let the viewer see it."
        },
        {
            "num": "SCENE 3 (1:15 - 1:50)",
            "title": "Submission & Persistent DBMS Storage",
            "action": "• Click the green button <b>'Submit Complaint to Government'</b>.<br/>• The modal transforms into the green <b>Success Receipt Card</b>.<br/>• Hover over the Tracking ID and Deduplication Status.<br/>• Click <b>'View on Dashboard'</b>.",
            "spoken": (
                "\"Once submitted, the complaint is sanitized for privacy and persistently stored in our local SQLite DBMS.<br/><br/>"
                "The citizen instantly receives a verified Tracking ID and confirmation receipt.<br/><br/>"
                "Now, returning to our Policymaker Dashboard, notice our <b>DBMS Stored counter</b> in the top bar has updated to 1 problem. "
                "There is zero fake mock data here—only real complaints submitted through the platform are shown.\""
            ),
            "note": "Tone: Reassuring and clear. Emphasize that the database is real and persistent."
        },
        {
            "num": "SCENE 4 (1:50 - 2:25)",
            "title": "The ML Severity Score out of 100",
            "action": "• Look at the newly added problem in the table.<br/>• Point mouse to the large score badge on the right (e.g. <b>88.5 / 100</b>).<br/>• Click <b>'View ML Model Scoring Factors'</b> to expand the breakdown boxes.<br/>• Point to the 4 factor boxes.",
            "spoken": (
                "\"Here in the directory, policymakers immediately see the problem summary, the verified location, and a precise "
                "<b>ML Severity Score out of 100</b>.<br/><br/>"
                "This score is calculated by our custom Machine Learning Severity Scorer based on four objective feature vectors:<br/>"
                "1. <b>Public Health & Hazard Risk (35%)</b>: detects toxic exposure or clinic impact.<br/>"
                "2. <b>Outage Duration (25%)</b>: penalizes multi-day deprivation.<br/>"
                "3. <b>Infrastructure Vulnerability (20%)</b>: weights baseline sector criticalities.<br/>"
                "4. <b>Sentiment Distress (20%)</b>: quantifies emergency language intensity.<br/><br/>"
                "This gives decision-makers an auditable, transparent mathematical rationale for prioritizing emergency interventions.\""
            ),
            "note": "Tone: Analytical and authoritative. Highlight the transparency of the ML model."
        },
        {
            "num": "SCENE 5 (2:25 - 2:55)",
            "title": "Embeddings & Topic Deduplication (+N Merged Reports)",
            "action": "• Click <b>'+ Add Problem'</b> again.<br/>• Select the New Delhi hub and submit another related report (e.g. <i>'Drinking water pipe broken near hospital'</i>).<br/>• Click Submit -> View on Dashboard.<br/>• Point to the badge: <b>'+2 merged reports'</b>.",
            "spoken": (
                "\"In real crises, hundreds of citizens report the exact same broken pipe or flooded street. "
                "Rather than flooding government queues with duplicate tickets, CivicPulse generates <b>TF-IDF semantic embeddings</b> "
                "and performs geospatial cosine similarity within a 15-kilometer radius.<br/><br/>"
                "As you can see, the second report was semantically matched and automatically merged into the existing issue, "
                "incrementing our counter to <b>'+2 merged reports'</b>. Policymakers gain immediate volume intelligence without ticket fatigue.\""
            ),
            "note": "Tone: Enthusiastic. Stress how this solves a major pain point for government operations."
        },
        {
            "num": "SCENE 6 (2:55 - 3:20)",
            "title": "AI Project Solutions & Conclusion",
            "action": "• On the left sidebar, click <b>'AI Project Solutions'</b>.<br/>• The view switches to the AI Prescriptive Projects directives.<br/>• Scroll gently through the generated directive cards.<br/>• End on the clean dashboard.",
            "spoken": (
                "\"Finally, CivicPulse bridges citizen complaints into capital public investment. In the 'AI Project Solutions' tab, "
                "our policy engine aggregates clustered grievances into structured, actionable development directives—complete with "
                "budget estimates, deployment timelines, and policy justifications aligned with national infrastructure plans.<br/><br/>"
                "CivicPulse empowers BRICS governments to listen in any language, evaluate through machine learning, and act with speed and transparency.<br/><br/>"
                "Thank you!\""
            ),
            "note": "Tone: Strong, inspiring closing. Smile and deliver with confidence."
        }
    ]

    for sc in scenes:
        header_text = f"<b>{sc['num']} — {sc['title']}</b>"
        story.append(Paragraph(header_text, h1_style))

        table_data = [
            [
                Paragraph("<b>WHERE TO OPEN & CLICK:</b>", h2_style),
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

        t = Table(table_data, colWidths=[130, 400])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), bg_light),
            ('BOX', (0,0), (-1,-1), 0.8, colors.HexColor("#CBD5E1")),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
            ('PADDING', (0,0), (-1,-1), 6),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        story.append(t)
        story.append(Spacer(1, 8))

    doc.build(story)
    print("PDF successfully generated at:", pdf_path)

if __name__ == "__main__":
    create_script_pdf()

"""
Script to generate the updated CIVICPULSE-BRICS.pptx presentation
using python-pptx with 16:9 widescreen layout and high-tech dark theme.
"""
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_deck(output_path="../CIVICPULSE-BRICS.pptx"):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # Blank slide layout

    # Colors
    BG_COLOR = RGBColor(10, 10, 14)       # Deep dark background
    CARD_BG = RGBColor(20, 22, 28)        # Charcoal card fill
    CARD_BORDER = RGBColor(40, 45, 58)    # Subtle border
    ACCENT_LIME = RGBColor(163, 230, 53)  # #A3E635 Electric Lime
    ACCENT_RED = RGBColor(239, 68, 68)    # Alert Red
    TEXT_WHITE = RGBColor(255, 255, 255)
    TEXT_MUTED = RGBColor(160, 166, 178)
    TEXT_DARK = RGBColor(10, 10, 14)

    def set_slide_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.fill.background()
        return bg

    def add_card(slide, left, top, width, height, bg_color=CARD_BG, border_color=CARD_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        if border_color:
            card.line.color.rgb = border_color
            card.line.width = Pt(1)
        else:
            card.line.fill.background()
        return card

    # ==========================================
    # SLIDE 1: TITLE SLIDE
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s1)
    
    # Background image if exists
    if os.path.exists("page1_img_0.png"):
        pic = s1.shapes.add_picture("page1_img_0.png", 0, 0, Inches(13.333), Inches(7.5))
        # Add dark overlay for readability
        overlay = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        overlay.fill.solid()
        overlay.fill.fore_color.rgb = RGBColor(5, 7, 12)
        # Note: python-pptx doesn't support transparency on shape fill directly, so we keep overlay subtle or rely on image contrast
        # Let's remove overlay if image itself is already dark, or keep it dark
        # The original image is already dark blue night highway!

    # Top category
    tb1_top = s1.shapes.add_textbox(Inches(0.8), Inches(0.6), Inches(11), Inches(0.8))
    tf1_top = tb1_top.text_frame
    tf1_top.word_wrap = True
    p = tf1_top.paragraphs[0]
    p.text = "BUILD WITH AI · CODE FOR COMMUNITIES — SECOND EDITION"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = ACCENT_LIME

    # Big Title
    tb1_title = s1.shapes.add_textbox(Inches(0.8), Inches(2.2), Inches(7.5), Inches(2.2))
    tf1_title = tb1_title.text_frame
    p = tf1_title.paragraphs[0]
    p.text = "CIVICPULSE\nBRICS"
    p.font.name = "Arial"
    p.font.size = Pt(56)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE

    # Subtitle
    tb1_sub = s1.shapes.add_textbox(Inches(0.8), Inches(4.7), Inches(7.5), Inches(1.2))
    tf1_sub = tb1_sub.text_frame
    tf1_sub.word_wrap = True
    p = tf1_sub.paragraphs[0]
    p.text = "Scalable AI-Driven Infrastructure Prioritization for Digital Public Goods"
    p.font.name = "Arial"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE
    
    p2 = tf1_sub.add_paragraph()
    p2.text = "“From Citizen Voices to Actionable Infrastructure Intelligence.”"
    p2.font.name = "Arial"
    p2.font.size = Pt(14)
    p2.font.italic = True
    p2.font.color.rgb = TEXT_MUTED

    # Right Card: Track & Team Info
    card_right = add_card(s1, Inches(8.5), Inches(3.4), Inches(4.2), Inches(3.2), bg_color=RGBColor(16, 20, 26), border_color=RGBColor(45, 55, 72))
    
    # Track badge
    badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.8), Inches(3.6), Inches(2.8), Inches(0.45))
    badge.fill.solid()
    badge.fill.fore_color.rgb = RGBColor(35, 55, 20)
    badge.line.color.rgb = ACCENT_LIME
    badge.line.width = Pt(1)
    tf_b = badge.text_frame
    p_b = tf_b.paragraphs[0]
    p_b.alignment = PP_ALIGN.CENTER
    p_b.text = "TRACK: OPEN INNOVATION"
    p_b.font.name = "Arial"
    p_b.font.size = Pt(11)
    p_b.font.bold = True
    p_b.font.color.rgb = ACCENT_LIME

    # Team & Flow
    tb_team = s1.shapes.add_textbox(Inches(8.8), Inches(4.2), Inches(3.7), Inches(2.2))
    tf_team = tb_team.text_frame
    tf_team.word_wrap = True
    p = tf_team.paragraphs[0]
    p.text = "Team: [Team Name]  ·  Members: [Names + Roles]"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_MUTED

    # Green accent divider line
    line = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(8.8), Inches(5.1), Inches(2.0), Inches(0.04))
    line.fill.solid()
    line.fill.fore_color.rgb = ACCENT_LIME
    line.line.fill.background()

    # UPDATED SUBTITLE
    p_flow = tf_team.add_paragraph()
    p_flow.space_before = Pt(24)
    p_flow.text = "CITIZENS  →  AI  →  SECTOR HEALTH MATRIX & TELEMETRY  →  POLICYMAKERS"
    p_flow.font.name = "Arial"
    p_flow.font.size = Pt(11)
    p_flow.font.bold = True
    p_flow.font.color.rgb = TEXT_WHITE

    # ==========================================
    # SLIDE 2: THE PROBLEM
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s2)

    # Title
    tb = s2.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.5), Inches(1.0))
    p = tb.text_frame.paragraphs[0]
    p.text = "Fragmented citizen voices delay action"
    p.font.name = "Arial"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE

    # Left Column: TODAY
    tb_left = s2.shapes.add_textbox(Inches(0.8), Inches(1.9), Inches(5.5), Inches(4.8))
    tf_left = tb_left.text_frame
    tf_left.word_wrap = True
    p_today = tf_left.paragraphs[0]
    p_today.text = "TODAY"
    p_today.font.name = "Arial"
    p_today.font.size = Pt(14)
    p_today.font.bold = True
    p_today.font.color.rgb = ACCENT_RED

    bullets = [
        "Voice, text, and messaging feedback is scattered across multiple channels.",
        "Reports arrive in different languages and regional dialects.",
        "Unstructured reports are difficult to analyze and deduplicate at scale.",
        "Critical infrastructure hotspots stay hard to detect before catastrophic failure."
    ]
    for b in bullets:
        p_b = tf_left.add_paragraph()
        p_b.space_before = Pt(16)
        p_b.text = "•  " + b
        p_b.font.name = "Arial"
        p_b.font.size = Pt(14)
        p_b.font.color.rgb = TEXT_WHITE

    # Right Column: Numbers + CORE GAP Card
    tb_num = s2.shapes.add_textbox(Inches(6.8), Inches(1.9), Inches(5.5), Inches(2.2))
    tf_num = tb_num.text_frame
    tf_num.word_wrap = True
    
    stages = [
        "1.  Citizen Reports",
        "2.  Data Silos",
        "3.  Limited Visibility",
        "4.  Delayed Prioritization"
    ]
    for i, stg in enumerate(stages):
        p_s = tf_num.paragraphs[0] if i == 0 else tf_num.add_paragraph()
        if i > 0:
            p_s.space_before = Pt(8)
        p_s.text = stg
        p_s.font.name = "Arial"
        p_s.font.size = Pt(15)
        p_s.font.bold = True
        p_s.font.color.rgb = TEXT_WHITE

    # CORE GAP CARD
    gap_card = add_card(s2, Inches(6.8), Inches(4.3), Inches(5.7), Inches(2.3), bg_color=RGBColor(18, 18, 22), border_color=RGBColor(45, 45, 55))
    tb_gap = s2.shapes.add_textbox(Inches(7.1), Inches(4.5), Inches(5.1), Inches(1.8))
    tf_gap = tb_gap.text_frame
    tf_gap.word_wrap = True
    p_gtitle = tf_gap.paragraphs[0]
    p_gtitle.text = "CORE GAP"
    p_gtitle.font.name = "Arial"
    p_gtitle.font.size = Pt(12)
    p_gtitle.font.bold = True
    p_gtitle.font.color.rgb = TEXT_MUTED

    p_g1 = tf_gap.add_paragraph()
    p_g1.space_before = Pt(8)
    p_g1.text = "Citizen feedback exists."
    p_g1.font.name = "Arial"
    p_g1.font.size = Pt(20)
    p_g1.font.bold = True
    p_g1.font.color.rgb = TEXT_WHITE

    p_g2 = tf_gap.add_paragraph()
    p_g2.space_before = Pt(4)
    p_g2.text = "Actionable intelligence doesn’t."
    p_g2.font.name = "Arial"
    p_g2.font.size = Pt(20)
    p_g2.font.bold = True
    p_g2.font.color.rgb = ACCENT_RED

    # ==========================================
    # SLIDE 3: THE SOLUTION
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s3)

    tb3 = s3.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.5), Inches(1.2))
    tf3 = tb3.text_frame
    p_tag = tf3.paragraphs[0]
    p_tag.text = "THE SOLUTION"
    p_tag.font.name = "Arial"
    p_tag.font.size = Pt(12)
    p_tag.font.bold = True
    p_tag.font.color.rgb = ACCENT_LIME

    p_title = tf3.add_paragraph()
    p_title.text = "From feedback to action"
    p_title.font.name = "Arial"
    p_title.font.size = Pt(34)
    p_title.font.bold = True
    p_title.font.color.rgb = TEXT_WHITE

    p_sub = tf3.add_paragraph()
    p_sub.space_before = Pt(4)
    p_sub.text = "CivicPulse BRICS turns citizen reports into geospatially prioritized infrastructure intelligence."
    p_sub.font.name = "Arial"
    p_sub.font.size = Pt(14)
    p_sub.font.color.rgb = TEXT_MUTED

    # 5 steps in 2 columns
    solution_steps = [
        ("REPORT", "Voice / Text / Custom Location & Auto-GPS", Inches(0.8), Inches(2.2)),
        ("UNDERSTAND", "AI Transcription + Multilingual Translation", Inches(6.8), Inches(2.2)),
        ("CLUSTER", "Geospatial Proximity Hotspots (10km DBSCAN)", Inches(0.8), Inches(3.4)),
        ("PRIORITIZE", "Multi-Factor ML Priority Index (0–100 Scorer)", Inches(6.8), Inches(3.4)),
        ("ACT", "AI Project Directives, Budgets & Policy Review", Inches(0.8), Inches(4.6)),
    ]

    for title, desc, left, top in solution_steps:
        card = add_card(s3, left, top, Inches(5.6), Inches(0.95))
        tb_st = s3.shapes.add_textbox(left + Inches(0.2), top + Inches(0.1), Inches(5.2), Inches(0.75))
        tf_st = tb_st.text_frame
        tf_st.word_wrap = True
        p_t = tf_st.paragraphs[0]
        p_t.text = title
        p_t.font.name = "Arial"
        p_t.font.size = Pt(13)
        p_t.font.bold = True
        p_t.font.color.rgb = ACCENT_LIME

        p_d = tf_st.add_paragraph()
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(12)
        p_d.font.color.rgb = TEXT_WHITE

    # Bottom Green Banner
    banner = s3.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.0), Inches(11.733), Inches(0.8))
    banner.fill.solid()
    banner.fill.fore_color.rgb = ACCENT_LIME
    banner.line.fill.background()
    tf_ban = banner.text_frame
    p_ban = tf_ban.paragraphs[0]
    p_ban.alignment = PP_ALIGN.CENTER
    p_ban.text = "Don’t just collect complaints. Identify emerging infrastructure needs."
    p_ban.font.name = "Arial"
    p_ban.font.size = Pt(16)
    p_ban.font.bold = True
    p_ban.font.color.rgb = TEXT_DARK

    # ==========================================
    # SLIDE 4: THE PLATFORM (CAPABILITIES)
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s4)

    tb4 = s4.shapes.add_textbox(Inches(0.8), Inches(0.6), Inches(11.5), Inches(1.1))
    tf4 = tb4.text_frame
    p = tf4.paragraphs[0]
    p.text = "THE PLATFORM"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_LIME

    p = tf4.add_paragraph()
    p.text = "One platform. Five capabilities."
    p.font.name = "Arial"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE

    # Top Row: 3 Cards
    caps_top = [
        ("01  Citizen Portal", "Voice + Text + Custom Location\nInteractive GPS detection & BRICS country selector", Inches(0.8)),
        ("02  Multilingual AI", "Transcription + Translation\nAutomatic dialect synthesis & hazard classification", Inches(4.8)),
        ("03  Geo-Intelligence", "10km Proximity Clustering\nDBSCAN grouping of isolated infrastructure requests", Inches(8.8)),
    ]
    for title, desc, left in caps_top:
        add_card(s4, left, Inches(2.0), Inches(3.7), Inches(2.2))
        tb_c = s4.shapes.add_textbox(left + Inches(0.2), Inches(2.1), Inches(3.3), Inches(1.9))
        tf_c = tb_c.text_frame
        tf_c.word_wrap = True
        p_t = tf_c.paragraphs[0]
        p_t.text = title
        p_t.font.name = "Arial"
        p_t.font.size = Pt(15)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_WHITE
        p_d = tf_c.add_paragraph()
        p_d.space_before = Pt(12)
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(12)
        p_d.font.color.rgb = TEXT_MUTED

    # Bottom Row: 2 Wider Cards (UPDATED CARD 05)
    caps_bot = [
        ("04  Priority Engine", "Volume + Outage Duration + Sector Deficit + Disruption Intensity\nCalculates unified 0–100 ML severity ranking across sectors", Inches(0.8), Inches(5.7)),
        ("05  Policy Command Center", "Sector Health Matrix + Autonomous Radar + AI Directives\nInteractive radial dials, live threat sweep radar & policy review briefs", Inches(6.8), Inches(5.7)),
    ]
    for title, desc, left, width in caps_bot:
        is_highlight = "05" in title
        bg = RGBColor(24, 30, 40) if is_highlight else CARD_BG
        border = ACCENT_LIME if is_highlight else CARD_BORDER
        add_card(s4, left, Inches(4.5), width, Inches(2.2), bg_color=bg, border_color=border)
        tb_c = s4.shapes.add_textbox(left + Inches(0.3), Inches(4.7), width - Inches(0.6), Inches(1.8))
        tf_c = tb_c.text_frame
        tf_c.word_wrap = True
        p_t = tf_c.paragraphs[0]
        p_t.text = title
        p_t.font.name = "Arial"
        p_t.font.size = Pt(16)
        p_t.font.bold = True
        p_t.font.color.rgb = ACCENT_LIME if is_highlight else TEXT_WHITE
        p_d = tf_c.add_paragraph()
        p_d.space_before = Pt(10)
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(13)
        p_d.font.color.rgb = TEXT_WHITE if is_highlight else TEXT_MUTED

    # ==========================================
    # SLIDE 5: INTELLIGENCE PIPELINE
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s5)

    tb5 = s5.shapes.add_textbox(Inches(0.8), Inches(0.6), Inches(11.5), Inches(1.1))
    tf5 = tb5.text_frame
    p = tf5.paragraphs[0]
    p.text = "TECHNICAL CORE"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_LIME

    p = tf5.add_paragraph()
    p.text = "The CivicPulse intelligence pipeline"
    p.font.name = "Arial"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE

    # 6 Sequential Pipeline Cards
    pipeline_steps = [
        ("01", "VOICE /\nTEXT", False),
        ("02", "GEMINI 2.5\nFLASH", False),
        ("03", "0–100 ML\nSEVERITY", False),
        ("04", "10KM\nDBSCAN", False),
        ("05", "PRIORITY\nINDEX", False),
        ("06", "AI POLICY\nBRIEF", True), # Highlighted
    ]

    card_w = Inches(1.8)
    card_gap = Inches(0.18)
    for i, (num, label, hl) in enumerate(pipeline_steps):
        left = Inches(0.8) + i * (card_w + card_gap)
        bg = ACCENT_LIME if hl else CARD_BG
        border = ACCENT_LIME if hl else CARD_BORDER
        add_card(s5, left, Inches(2.0), card_w, Inches(2.0), bg_color=bg, border_color=border)
        
        tb_p = s5.shapes.add_textbox(left + Inches(0.15), Inches(2.1), card_w - Inches(0.3), Inches(1.7))
        tf_p = tb_p.text_frame
        p_n = tf_p.paragraphs[0]
        p_n.text = num
        p_n.font.name = "Arial"
        p_n.font.size = Pt(16)
        p_n.font.bold = True
        p_n.font.color.rgb = TEXT_DARK if hl else ACCENT_LIME

        # Little green underline for non-highlighted
        if not hl:
            line_p = s5.shapes.add_shape(MSO_SHAPE.RECTANGLE, left + Inches(0.15), Inches(2.6), Inches(0.8), Inches(0.02))
            line_p.fill.solid()
            line_p.fill.fore_color.rgb = ACCENT_LIME
            line_p.line.fill.background()

        p_l = tf_p.add_paragraph()
        p_l.space_before = Pt(14)
        p_l.text = label
        p_l.font.name = "Arial"
        p_l.font.size = Pt(12)
        p_l.font.bold = True
        p_l.font.color.rgb = TEXT_DARK if hl else TEXT_WHITE

    # Detailed Summary Card (UPDATED)
    summary_card = add_card(s5, Inches(0.8), Inches(4.4), Inches(11.733), Inches(2.3))
    tb_sum = s5.shapes.add_textbox(Inches(1.1), Inches(4.6), Inches(11.1), Inches(1.9))
    tf_sum = tb_sum.text_frame
    tf_sum.word_wrap = True

    p = tf_sum.paragraphs[0]
    p.text = "Transcribe  ·  Translate  ·  Categorize  ·  0–100 Multi-Factor Severity Scorer  ·  Geospatial Clustering  ·  Sector Health Deficit"
    p.font.name = "Arial"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE

    p = tf_sum.add_paragraph()
    p.space_before = Pt(12)
    p.text = "TECHNICAL CORE"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_LIME

    p = tf_sum.add_paragraph()
    p.space_before = Pt(4)
    p.text = "Gemini 2.5 Flash API  +  Scikit-Learn DBSCAN  +  Haversine Matrix  +  Zero-Setup SQLite / PostgreSQL"
    p.font.name = "Arial"
    p.font.size = Pt(14)
    p.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 6: DECISION SURFACE
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s6)

    tb6 = s6.shapes.add_textbox(Inches(0.8), Inches(0.6), Inches(11.5), Inches(1.1))
    tf6 = tb6.text_frame
    p = tf6.paragraphs[0]
    p.text = "DECISION SURFACE"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_LIME

    p = tf6.add_paragraph()
    p.text = "From data to decision"
    p.font.name = "Arial"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE

    # Top Row: 3 Decision Columns (UPDATED COL 1)
    dec_cols = [
        ("SECTOR MATRIX & RADAR", "Real-time radial gauges for Water, Roads, Power, Sanitation & autonomous threat radar sweep.", Inches(0.8)),
        ("LIVE FEED & TELEMETRY", "Anonymized, AI-translated citizen requests with live institutional status tickers.", Inches(4.8)),
        ("AI POLICY DIRECTIVES", "Autonomous project solutions with actionable budgets, timelines, and policy review citations.", Inches(8.8)),
    ]
    for title, desc, left in dec_cols:
        add_card(s6, left, Inches(2.0), Inches(3.7), Inches(2.2))
        tb_c = s6.shapes.add_textbox(left + Inches(0.2), Inches(2.1), Inches(3.3), Inches(1.9))
        tf_c = tb_c.text_frame
        tf_c.word_wrap = True
        p_t = tf_c.paragraphs[0]
        p_t.text = title
        p_t.font.name = "Arial"
        p_t.font.size = Pt(14)
        p_t.font.bold = True
        p_t.font.color.rgb = ACCENT_LIME
        p_d = tf_c.add_paragraph()
        p_d.space_before = Pt(12)
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(13)
        p_d.font.color.rgb = TEXT_WHITE

    # Bottom Row: 4-Step Chevron Flow
    chevrons = [
        ("1", "50 Citizen Reports", Inches(0.8), False),
        ("2", "1 Geographic Hotspot", Inches(3.8), False),
        ("3", "1 Priority Project", Inches(6.8), False),
        ("4", "Policy Action", Inches(9.8), True), # Highlighted
    ]
    for num, lbl, left, hl in chevrons:
        bg = ACCENT_LIME if hl else CARD_BG
        border = ACCENT_LIME if hl else CARD_BORDER
        add_card(s6, left, Inches(4.7), Inches(2.7), Inches(1.9), bg_color=bg, border_color=border)
        tb_ch = s6.shapes.add_textbox(left + Inches(0.2), Inches(4.8), Inches(2.3), Inches(1.6))
        tf_ch = tb_ch.text_frame
        p_n = tf_ch.paragraphs[0]
        p_n.alignment = PP_ALIGN.CENTER
        p_n.text = num
        p_n.font.name = "Arial"
        p_n.font.size = Pt(32)
        p_n.font.bold = True
        p_n.font.color.rgb = TEXT_DARK if hl else ACCENT_LIME

        p_l = tf_ch.add_paragraph()
        p_l.alignment = PP_ALIGN.CENTER
        p_l.space_before = Pt(8)
        p_l.text = lbl
        p_l.font.name = "Arial"
        p_l.font.size = Pt(13)
        p_l.font.bold = True
        p_l.font.color.rgb = TEXT_DARK if hl else TEXT_WHITE

    # ==========================================
    # SLIDE 7: SYSTEM DESIGN (ARCHITECTURE)
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s7)

    tb7 = s7.shapes.add_textbox(Inches(0.8), Inches(0.6), Inches(11.5), Inches(1.1))
    tf7 = tb7.text_frame
    p = tf7.paragraphs[0]
    p.text = "SYSTEM DESIGN"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_LIME

    p = tf7.add_paragraph()
    p.text = "Simple, scalable architecture"
    p.font.name = "Arial"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE

    # 6 Architecture Grid Cards (UPDATED OUTPUT & DATA)
    arch_grid = [
        ("INPUT", "Citizen Portal · Voice | Text | Custom Location | BRICS Nation Selector", Inches(0.8), Inches(2.0), False),
        ("API", "FastAPI (Async Python 3.11 Backend) + Next.js 14 App Router", Inches(4.8), Inches(2.0), False),
        ("AI", "Gemini 2.5 Flash · Multilingual NLU & Generative Project Solutions", Inches(8.8), Inches(2.0), False),
        ("DATA", "SQLite (Zero-Setup Engine) / PostgreSQL + PostGIS", Inches(0.8), Inches(4.0), False),
        ("INTELLIGENCE", "Scikit-Learn DBSCAN (10km Proximity) + 0–100 ML Severity Scorer", Inches(4.8), Inches(4.0), False),
        ("OUTPUT", "Policymaker Command Center · Sector Health Matrix & Autonomous Radar", Inches(8.8), Inches(4.0), True),
    ]

    for title, desc, left, top, hl in arch_grid:
        bg = ACCENT_LIME if hl else CARD_BG
        border = ACCENT_LIME if hl else CARD_BORDER
        add_card(s7, left, top, Inches(3.7), Inches(1.8), bg_color=bg, border_color=border)
        
        tb_a = s7.shapes.add_textbox(left + Inches(0.2), top + Inches(0.15), Inches(3.3), Inches(1.5))
        tf_a = tb_a.text_frame
        tf_a.word_wrap = True
        p_t = tf_a.paragraphs[0]
        p_t.text = title
        p_t.font.name = "Arial"
        p_t.font.size = Pt(14)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_DARK if hl else ACCENT_LIME

        p_d = tf_a.add_paragraph()
        p_d.space_before = Pt(8)
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(12)
        p_d.font.color.rgb = TEXT_DARK if hl else TEXT_WHITE

    # Supporting Tech Footer
    tb_foot = s7.shapes.add_textbox(Inches(0.8), Inches(6.2), Inches(11.733), Inches(0.6))
    p_f = tb_foot.text_frame.paragraphs[0]
    p_f.text = "Supporting technologies:  Tailwind CSS  ·  Lucide Icons  ·  HTML5 Canvas Radar  ·  Interactive SVG Dials  ·  REST APIs"
    p_f.font.name = "Arial"
    p_f.font.size = Pt(12)
    p_f.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 8: PRODUCTION-READY BY DESIGN
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s8)

    tb8 = s8.shapes.add_textbox(Inches(0.8), Inches(0.6), Inches(11.5), Inches(1.1))
    tf8 = tb8.text_frame
    p = tf8.paragraphs[0]
    p.text = "PRODUCTION-READY BY DESIGN"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_LIME

    p = tf8.add_paragraph()
    p.text = "Built for real-world civic systems"
    p.font.name = "Arial"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE

    # 4 Cards
    prod_cards = [
        ("PRIVACY", "PII sanitization & anonymization before persistence", Inches(0.8)),
        ("SECURITY", "JWT + HTTP-only cookies & input schema validation", Inches(3.8)),
        ("ACCESS CONTROL", "RBAC: SuperAdmin | Policymaker | Analyst | Citizen", Inches(6.8)),
        ("SCALABILITY", "Local ward → Regional → National → BRICS-scale", Inches(9.8)),
    ]
    for title, desc, left in prod_cards:
        add_card(s8, left, Inches(2.0), Inches(2.7), Inches(3.0))
        tb_c = s8.shapes.add_textbox(left + Inches(0.2), Inches(2.2), Inches(2.3), Inches(2.5))
        tf_c = tb_c.text_frame
        tf_c.word_wrap = True
        p_t = tf_c.paragraphs[0]
        p_t.text = title
        p_t.font.name = "Arial"
        p_t.font.size = Pt(14)
        p_t.font.bold = True
        p_t.font.color.rgb = ACCENT_LIME
        p_d = tf_c.add_paragraph()
        p_d.space_before = Pt(14)
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(13)
        p_d.font.color.rgb = TEXT_WHITE

    # Success Metrics Banner
    succ_card = s8.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(5.5), Inches(11.733), Inches(1.1))
    succ_card.fill.solid()
    succ_card.fill.fore_color.rgb = ACCENT_LIME
    succ_card.line.fill.background()
    tf_succ = succ_card.text_frame
    p_s1 = tf_succ.paragraphs[0]
    p_s1.alignment = PP_ALIGN.CENTER
    p_s1.text = "SUCCESS METRICS"
    p_s1.font.name = "Arial"
    p_s1.font.size = Pt(12)
    p_s1.font.bold = True
    p_s1.font.color.rgb = TEXT_DARK
    p_s2 = tf_succ.add_paragraph()
    p_s2.alignment = PP_ALIGN.CENTER
    p_s2.space_before = Pt(4)
    p_s2.text = "Processing Time  ·  Cluster Quality  ·  Multi-Factor ML Accuracy  ·  PII Removal Effectiveness"
    p_s2.font.name = "Arial"
    p_s2.font.size = Pt(15)
    p_s2.font.bold = True
    p_s2.font.color.rgb = TEXT_DARK

    # ==========================================
    # SLIDE 9: THE END-TO-END PROMISE
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s9)

    tb9 = s9.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.5), Inches(1.1))
    tf9 = tb9.text_frame
    p = tf9.paragraphs[0]
    p.text = "THE END-TO-END PROMISE"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_LIME

    p = tf9.add_paragraph()
    p.text = "One report → one actionable decision"
    p.font.name = "Arial"
    p.font.size = Pt(34)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE

    # Left Column: 8 numbered points
    tb_left9 = s9.shapes.add_textbox(Inches(0.8), Inches(1.8), Inches(5.5), Inches(4.8))
    tf_left9 = tb_left9.text_frame
    tf_left9.word_wrap = True
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
    for i, s_txt in enumerate(steps_9):
        p_s = tf_left9.paragraphs[0] if i == 0 else tf_left9.add_paragraph()
        if i > 0:
            p_s.space_before = Pt(8)
        p_s.text = s_txt
        p_s.font.name = "Arial"
        p_s.font.size = Pt(13)
        p_s.font.bold = True
        p_s.font.color.rgb = TEXT_WHITE

    # Right Column: Example Card + Tagline
    add_card(s9, Inches(6.8), Inches(1.8), Inches(5.7), Inches(2.2))
    tb_ex = s9.shapes.add_textbox(Inches(7.1), Inches(2.0), Inches(5.1), Inches(1.8))
    tf_ex = tb_ex.text_frame
    tf_ex.word_wrap = True
    p_ex_t = tf_ex.paragraphs[0]
    p_ex_t.text = "REAL-WORLD EXAMPLE"
    p_ex_t.font.name = "Arial"
    p_ex_t.font.size = Pt(12)
    p_ex_t.font.bold = True
    p_ex_t.font.color.rgb = ACCENT_LIME

    p_ex_d = tf_ex.add_paragraph()
    p_ex_d.space_before = Pt(8)
    p_ex_d.text = "“Pipeline rupture reported in Ward 4”\n→ Hotspot detected (10km DBSCAN)\n→ ML Severity 88/100 (Critical Hazard)\n→ Project Brief auto-drafted with $85,000 budget & 4-day timeline"
    p_ex_d.font.name = "Arial"
    p_ex_d.font.size = Pt(13)
    p_ex_d.font.color.rgb = TEXT_WHITE

    # Brand Block
    tb_brand = s9.shapes.add_textbox(Inches(6.8), Inches(4.3), Inches(5.7), Inches(2.3))
    tf_brand = tb_brand.text_frame
    tf_brand.word_wrap = True
    p_b1 = tf_brand.paragraphs[0]
    p_b1.text = "CIVICPULSE BRICS"
    p_b1.font.name = "Arial"
    p_b1.font.size = Pt(20)
    p_b1.font.bold = True
    p_b1.font.color.rgb = ACCENT_LIME

    p_b2 = tf_brand.add_paragraph()
    p_b2.space_before = Pt(6)
    p_b2.text = "“Turning Citizen Voices into Actionable Infrastructure Intelligence.”"
    p_b2.font.name = "Arial"
    p_b2.font.size = Pt(14)
    p_b2.font.italic = True
    p_b2.font.color.rgb = TEXT_WHITE

    p_b3 = tf_brand.add_paragraph()
    p_b3.space_before = Pt(8)
    p_b3.text = "Build with AI: Code for Communities — Second Edition\nMultilingual AI · Geospatial Intelligence · Digital Public Goods"
    p_b3.font.name = "Arial"
    p_b3.font.size = Pt(11)
    p_b3.font.color.rgb = TEXT_MUTED

    # Save presentation
    prs.save(output_path)
    print(f"Presentation saved successfully at {output_path}")

if __name__ == "__main__":
    create_deck()

"""
build_system_design_doc.py
Full Production Document Generator for Cocoa Bliss Corrected System Design.
"""

import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

DOCX_OUT = r"d:\PROJECTS\COCOA BLISS\Cocoa_Bliss_Corrected_System_Design.docx"
IMG_DIR = r"d:\PROJECTS\COCOA BLISS\system_design_diagrams"

def set_cell_bg(cell, hex_code):
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_code}"/>')
    cell._tc.get_or_add_tcPr().append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=180, right=180):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_table_borders(table, color="CBD5E1", sz="4"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'  <w:top w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'  <w:bottom w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'  <w:insideH w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'  <w:left w:val="none"/>'
        f'  <w:right w:val="none"/>'
        f'  <w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def add_styled_heading(doc, text, level):
    h = doc.add_heading(text, level=level)
    h.paragraph_format.space_before = Pt(14)
    h.paragraph_format.space_after = Pt(6)
    h.paragraph_format.keep_with_next = True
    run = h.runs[0]
    if level == 1:
        run.font.size = Pt(17)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x2A, 0x15, 0x0D)
    elif level == 2:
        run.font.size = Pt(13.5)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x78, 0x35, 0x0F)
    elif level == 3:
        run.font.size = Pt(11)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x1E, 0x0D, 0x06)
    return h

def add_callout(doc, title, text, border_color="3B82F6", bg_color="EFF6FF", icon="[INFO]"):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    table.columns[0].width = Inches(6.5)
    
    cell = table.cell(0, 0)
    set_cell_bg(cell, bg_color)
    set_cell_margins(cell, top=130, bottom=130, left=180, right=180)
    
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'  <w:left w:val="single" w:sz="24" w:space="0" w:color="{border_color}"/>'
        f'  <w:top w:val="none"/>'
        f'  <w:right w:val="none"/>'
        f'  <w:bottom w:val="none"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(3)
    r_title = p.add_run(f"{icon} {title}\n")
    r_title.bold = True
    r_title.font.size = Pt(10)
    if border_color == "B91C1C":
        r_title.font.color.rgb = RGBColor(0x99, 0x1B, 0x1B)
    elif border_color == "D97706":
        r_title.font.color.rgb = RGBColor(0x92, 0x40, 0x0E)
    else:
        r_title.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)
    
    r_text = p.add_run(text)
    r_text.font.size = Pt(9.5)
    r_text.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
    
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def add_table(doc, headers, rows, col_widths=None):
    table = doc.add_table(rows=len(rows) + 1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    set_table_borders(table, color="CBD5E1", sz="6")
    
    # Header
    hdr_cells = table.rows[0].cells
    for i, h in enumerate(headers):
        hdr_cells[i].text = h
        set_cell_bg(hdr_cells[i], "2A150D")
        set_cell_margins(hdr_cells[i], top=110, bottom=110, left=140, right=140)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        for run in p.runs:
            run.font.bold = True
            run.font.size = Pt(9)
            run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
            
    # Rows
    for r_idx, row_data in enumerate(rows):
        row_cells = table.rows[r_idx + 1].cells
        bg_col = "F8FAFC" if (r_idx % 2 == 1) else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            row_cells[c_idx].text = str(val)
            set_cell_bg(row_cells[c_idx], bg_col)
            set_cell_margins(row_cells[c_idx], top=80, bottom=80, left=130, right=130)
            p = row_cells[c_idx].paragraphs[0]
            for run in p.runs:
                run.font.size = Pt(8.5)
                run.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
                
    if col_widths:
        for r in table.rows:
            for i, w in enumerate(col_widths):
                r.cells[i].width = Inches(w)
                
    doc.add_paragraph().paragraph_format.space_after = Pt(6)

def add_figure(doc, img_path, caption, width_in=6.2):
    if not os.path.exists(img_path):
        p = doc.add_paragraph(f"[Image file missing: {img_path}]")
        return
    p_img = doc.add_paragraph()
    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img.paragraph_format.space_before = Pt(8)
    p_img.paragraph_format.space_after = Pt(3)
    p_img.add_run().add_picture(img_path, width=Inches(width_in))
    
    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_before = Pt(2)
    p_cap.paragraph_format.space_after = Pt(8)
    run_cap = p_cap.add_run(caption)
    run_cap.font.size = Pt(8.5)
    run_cap.font.italic = True
    run_cap.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

def build_document():
    doc = Document()
    
    # Page setup - Margins
    sections = doc.sections
    for s in sections:
        s.top_margin = Inches(0.8)
        s.bottom_margin = Inches(0.8)
        s.left_margin = Inches(0.8)
        s.right_margin = Inches(0.8)
        
    # Document Title Block
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(12)
    p_title.paragraph_format.space_after = Pt(4)
    run_title = p_title.add_run("COCOA BLISS — SYSTEM DESIGN SPECIFICATION\n& ARCHITECTURAL AUDIT REPORT")
    run_title.font.size = Pt(22)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(0x2A, 0x15, 0x0D)
    
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(14)
    run_sub = p_sub.add_run("Forensic Diagram Evaluation, UML 2.5 Re-Engineering, Complete Relational Database Schema, and User Interface Traceability\n"
                            "Structured in Identical Order to the Cocoa Bliss System Design PDF (Pages 1 to 10)")
    run_sub.font.size = Pt(10.5)
    run_sub.font.italic = True
    run_sub.font.color.rgb = RGBColor(0x78, 0x35, 0x0F)
    
    # Metadata Box
    add_table(doc, 
              ["Metadata Attribute", "Project Specification Details"],
              [
                  ["Application Name", "Cocoa Bliss — Dedicated Handcrafted Chocolates E-Commerce Boutique"],
                  ["Document Purpose", "System Design Correction, Flaw Identification, Diagram Replacement & Schema Rectification"],
                  ["Frontend Technology", "React 19, TypeScript 5.9, Vite 8.2, Tailwind CSS 3.4, React Router DOM, Lucide Icons"],
                  ["Backend Architecture", "Python 3.14+, Django 6.1+, Django REST Framework 3.18, Token & Session Authentication"],
                  ["Relational Database", "MySQL (with PyMySQL driver) / SQLite zero-configuration development fallback"],
                  ["Special Security Workflows", "Super Admin Approval Workflow for Public Admin Applicants (role='admin', admin_status='approved')"],
                  ["Compliance Standard", "OMG UML 2.5 (Unified Modeling Language), Third Normal Form (3NF) Relational Database Schema"]
              ],
              col_widths=[2.2, 4.3])
    
    # =========================================================================
    # EXECUTIVE SUMMARY & SYSTEMIC AUDIT MATRIX
    # =========================================================================
    add_styled_heading(doc, "Executive Summary & Systematic Audit Matrix", level=1)
    
    p_intro = doc.add_paragraph(
        "This engineering document provides a rigorous, point-by-point forensic analysis and complete architectural overhaul "
        "of the original Cocoa Bliss System Design PDF (10 pages) and the user's four redrawn diagram attempts. "
        "The evaluation reveals critical conceptual defects in both the original PDF and the redrawn versions—including "
        "anti-patterns that violate fundamental UML 2.5 syntax standards (such as the misuse of concurrency fork/join bars for user navigation "
        "and embedding physical SQL foreign keys inside UML class attributes) as well as severe database integrity hazards "
        "(such as mutable line-item references that corrupt historical tax invoices upon catalog updates).\n\n"
        "To provide a production-ready, academically rigorous reference, every diagram and database table has been corrected and "
        "expanded to faithfully represent the actual operational capabilities of the Cocoa Bliss platform. "
        "The structure of this document maintains the exact page-by-page sequence of the original System Design PDF:"
    )
    p_intro.paragraph_format.space_after = Pt(8)
    
    # Master Audit Matrix
    add_table(doc,
              ["Section & PDF Page", "Original PDF Flaws", "User Redraw Attempt Evaluation", "Corrected Production Architecture"],
              [
                  ["1. Use Case Diagram\n(PDF Page 1)",
                   "• Completely flat associations (no <<include>> or <<extend>>).\n• Micro-actions & GUI pages (Dashboard, Checkout, Select Payment) treated as separate use cases.\n• No actor hierarchy.",
                   "• Renamed verbs cleanly.\n[CRITICAL ERRORS]: Dropped implemented features (Wishlist, Invoices, Price Filter/Sort, Manage Cart).\n• Hallucinated non-existent features (Manage Content, Offers).\n• Still flat with zero UML stereotypes.",
                   "• UML 2.5 compliant system boundary with 23 modular use cases.\n• <<include>> for Address & Payment Processing; <<extend>> for Filter/Sort & GST Invoices.\n• Generalization actor hierarchy: Super Admin inherits from Administrator."],
                  
                  ["2. Customer Activity\nDiagram (PDF Page 2)",
                   "• Strict waterfall pipeline forcing every customer into a single linear sequence.\n• User forced to review product, edit profile, and logout after purchasing chocolate.\n• Conflated registration & login.",
                   "• Separated Login and Register with decision diamond.\n[FATAL UML SYNTAX ERROR]: Used a heavy FORK BAR to split into 7 parallel lanes and a JOIN BAR before Logout!\n• Mandates concurrent simultaneous execution of all 7 paths before logout!",
                   "• Eliminated fork/join concurrency blunder.\n• Modeled authentic Decision/Choice navigation loop with swimlanes (Customer UI vs Backend API/DB).\n• Supports guest browsing, cart free-delivery checks (≥ ₹999), 5-stage order tracking, and GST invoicing."],
                  
                  ["3. Admin Activity\nDiagram (PDF Page 3)",
                   "• Monolithic linear conveyor belt forcing admin to visit every module in sequence before logging out.\n• No branching or selective operational workflow.",
                   "• Decomposed modules into sub-steps.\n[FATAL UML SYNTAX ERROR]: Exactly identical Fork/Join concurrency blunder across 6 admin sections.\n• Ignored Cocoa Bliss Super Admin approval workflow; drew generic 'Add/Edit User'.",
                   "• Replaced fork/join with Admin Decision Menu Loop.\n• Integrated strict 2-tier security gate (role check + admin_status approval).\n• Dedicated Super Admin applicant approval pipeline (`admin@cocoabliss.com`) and low-stock alert monitoring."],
                  
                  ["4. Class Diagram\n(PDF Page 4 Top)",
                   "• Relational ERD masquerading as UML Class Diagram.\n• Classes contain physical SQL types (varchar, text), explicit PK/FK notations, and relational legend.\n• Missing Wishlist and Notification classes.",
                   "• Converted SQL types to primitive types (int, String).\n[REMAINING ERRORS]: Retained relational FK attributes (userId, productId).\n• CRUD methods placed on entity objects (Active Record antipattern).\n• Omitted Wishlist and Notifications.",
                   "• Pure UML 2.5 Domain Model.\n• Eliminated raw foreign key attributes in favor of associations & compositions.\n• UML Composition (◆---) for Order/OrderItem, Cart/CartItem, Wishlist/WishlistItem.\n• Includes all 12 system domain entities with domain methods."],
                  
                  ["5. Database Design\n(PDF Pages 4-6)",
                   "• Missing delivery charges breakdown (< ₹999 incurs ₹99).\n• OrderItem only stores FK to product: deleting or updating chocolate alters historical orders!\n• Missing Wishlist & Notification tables.\n• Missing admin_status for Super Admin.",
                   "• (The user did not provide a redrawn database design; relied on flawed PDF schema).",
                   "• Comprehensive 12-table relational schema in 3NF.\n• Historical order immutability via snapshot columns (product_name_snapshot, weight_snapshot, unit_price) and ON DELETE SET NULL.\n• Full Wishlist, Wishlist Items, and In-App Notifications tables."],
                  
                  ["6. User Interface\nDesigns (PDF Pages 7-10)",
                   "• High-fidelity visual mockups of Login, Register, Storefront Home, and Admin Suite.\n• Lacked architectural trace matrices linking UI components to backend endpoints.",
                   "• (User provided no UI redesigns; current UI is fully authentic).",
                   "• Retained authentic Cocoa Bliss UI screens with comprehensive design system documentation (warm cocoa tokens, Playfair Display typography).\n• End-to-end trace matrices connecting UI widgets directly to DB tables & API routes."]
              ],
              col_widths=[1.3, 1.7, 1.8, 1.7])
    
    doc.add_page_break()
    
    # =========================================================================
    # SECTION 1: USE CASE DIAGRAM (PDF Page 1)
    # =========================================================================
    add_styled_heading(doc, "Section 1: Use Case Diagram (System Design PDF Page 1)", level=1)
    
    doc.add_paragraph(
        "A Use Case Diagram in UML 2.5 defines the functional boundary of a system, the external actors who interact with it, "
        "and the specific goal-oriented interactions (use cases) that produce an observable result of value to those actors."
    )
    
    add_styled_heading(doc, "1.1 Forensic Analysis & Flaws of Original PDF Page 1", level=2)
    add_callout(doc, "Defects Identified in System Design PDF (Page 1)",
                "1. Flat Functional Decomposition Anti-Pattern: Every single oval is directly wired to the actor via a solid association line. "
                "There are zero «include» or «extend» relationships, violating standard UML modularity.\n"
                "2. Conflation of UI Micro-Steps with Business Goals: Elements such as 'Checkout', 'Select Payment Method', and 'Place Order' "
                "are fragmented into three disjointed root use cases. In e-commerce, checkout and payment selection are included sub-steps of placing an order.\n"
                "3. Inappropriate Inclusion of GUI Views: 'Dashboard' is listed as a primary admin use case. A dashboard is a graphical user interface screen, "
                "not an actor-oriented business goal.\n"
                "4. Flat Actor Model: The original diagram models 'Administrator' as a single flat actor, completely missing the multi-tier privilege hierarchy "
                "where only the Super Admin has the authority to approve newly registered admin applicants.",
                border_color="B91C1C", bg_color="FEF2F2", icon="[CRITICAL FLAW]")
    
    add_styled_heading(doc, "1.2 Evaluation of User's Redrawn Use Case Diagram (Attached Image 1)", level=2)
    add_callout(doc, "Audit of User's Redrawn Attempt (Image 1)",
                "PROS / STRENGTHS:\n"
                "• Cleaned up several verb phrases (e.g., 'Write Review' instead of 'Submit Review / Rating', 'Make Payment', 'Track Orders').\n\n"
                "CRITICAL DEFECTS & NEW ERRORS INTRODUCED:\n"
                "1. Omission of Implemented System Features: The user completely removed 'Add to Wishlist' and 'View Wishlist' "
                "(even though Cocoa Bliss has a dedicated wishlist Django backend app and frontend context!). The user also removed 'Filter / Sort Chocolates', "
                "'View Invoice' (GST invoice generation is a signature feature of Cocoa Bliss), and 'Manage Cart' (reducing cart actions to only Add to Cart).\n"
                "2. Hallucination of Non-Existent Features: The user added 'Manage Website Content' and 'Manage Offers' under Admin. "
                "These modules do not exist anywhere in the Cocoa Bliss codebase or database schema.\n"
                "3. Redundancy: The user added 'View Customer Feedback' in addition to 'Manage Reviews', which are functionally identical.\n"
                "4. Persistence of Flat Association Anti-Pattern: The redrawn diagram still features zero «include» or «extend» relationships, "
                "wiring every use case directly to the actors.",
                border_color="D97706", bg_color="FFFBEB", icon="[REDRAW EVALUATION]")
    
    add_styled_heading(doc, "1.3 Replacement Matrix: Original vs User Redraw vs Corrected Architecture", level=2)
    add_table(doc,
              ["Functional Element", "PDF Page 1 (Original)", "User Redraw (Image 1)", "Corrected Cocoa Bliss Architecture"],
              [
                  ["Customer Shopping Cart", "Add to Cart, Manage Cart (Separated)", "Only 'Add to Cart' (Manage Cart removed)", "Unified 'Manage Shopping Cart' (encompassing Add, Update Qty, Remove & Free Delivery Check)."],
                  ["Product Discovery", "Browse, Search, Filter/Sort (Flat)", "Browse Products, Search Products (Filter removed)", "'Browse Chocolate Catalog' extended by «extend» 'Filter & Sort Chocolates' (price slider, categories)."],
                  ["Customer Wishlist", "Add to Wishlist, View Wishlist", "COMPLETELY REMOVED", "Retained: 'Manage Wishlist' (dedicated Django app with persistent relational storage)."],
                  ["Checkout & Invoicing", "Checkout, Select Payment, Place Order (Flat)", "Place Order, Make Payment (Flat)", "'Checkout & Place Order' includes «include» 'Select Delivery Address' & 'Process Payment'; extended by «extend» 'Download Tax Invoice'."],
                  ["Administrator Roles", "Single 'Administrator' actor", "Single 'Admin' actor", "'Administrator' generalized into 'Super Administrator' (admin@cocoabliss.com) via UML generalization."],
                  ["Admin Approvals", "Missing completely", "Missing completely ('Manage Users' drawn)", "Explicit 'Review & Approve Admin Applicants' reserved exclusively for Super Admin."],
                  ["Hallucinated Features", "None", "'Manage Website Content', 'Manage Offers'", "Purged from diagram to strictly reflect actual project implementation."]
              ],
              col_widths=[1.5, 1.6, 1.6, 1.8])
    
    add_styled_heading(doc, "1.4 Corrected Cocoa Bliss Use Case Diagram", level=2)
    add_figure(doc, os.path.join(IMG_DIR, "corrected_use_case_diagram.png"),
               "Figure 1.1: Corrected UML 2.5 Use Case Diagram for Cocoa Bliss E-Commerce Platform (High Resolution)", width_in=6.2)
    
    add_styled_heading(doc, "1.5 Comparison with User's Redrawn Use Case Diagram", level=2)
    add_figure(doc, os.path.join(IMG_DIR, "user_redraw_use_case.jpg"),
               "Figure 1.2: Client/Student Redrawn Use Case Diagram (Evaluated for Deficiencies & Omissions)", width_in=5.8)
    
    add_styled_heading(doc, "1.6 Formal Use Case Specifications Dictionary", level=2)
    add_table(doc,
              ["UC ID & Name", "Primary Actor", "Preconditions", "Trigger & Execution Summary", "Postconditions"],
              [
                  ["UC1: Register / Apply Admin", "Customer / Applicant", "Guest user on registration page", "User submits Full Name, Email, Phone, Address, Password, and selects Role (Customer or Admin).", "User account created; if Admin requested, admin_status set to 'pending'."],
                  ["UC2: Login & Authentication", "Customer / Admin", "User has registered account", "User submits email and password; backend verifies PBKDF2 hash and issues DRF Auth Token.", "User authenticated; session established with role-based dashboard access."],
                  ["UC3: Browse Catalog", "Customer / Guest", "Storefront accessible", "Customer navigates chocolate collection by category slug or featured tags.", "Products displayed with image, price, weight, and stock status."],
                  ["UC4: Filter & Sort Chocolates", "Customer / Guest", "Catalog page loaded", "Extends UC3: Customer adjusts interactive price slider, toggles in-stock filter, or sorts by price/rating.", "Filtered chocolate list dynamically updated without full page reload."],
                  ["UC6: Manage Shopping Cart", "Customer", "User active", "Customer adds item to cart, increments quantity, or removes item. System recalculates subtotal and free shipping (≥ ₹999).", "Persistent cart record updated in MySQL database."],
                  ["UC7: Manage Wishlist", "Customer", "Customer authenticated", "Customer toggles heart icon on chocolate card to save favorites for future purchase.", "WishlistItem persisted; badge count in navbar updated."],
                  ["UC8: Checkout & Place Order", "Customer", "Cart contains ≥ 1 available item", "Includes UC13 (Address) and UC14 (Payment). System verifies inventory limits, snapshots items, and confirms order.", "Order generated (CB-2026-XXXXX), stock decremented, notification dispatched."],
                  ["UC10: Download Tax Invoice", "Customer", "Order successfully placed", "Extends UC9: Customer clicks 'Download Invoice' on order detail page.", "Itemized GST tax invoice rendered with company header and shipping details."],
                  ["UC11: Submit Product Review", "Customer", "Customer authenticated", "Customer submits 1–5 star rating and written comment for a chocolate product.", "Review stored in database; product average rating automatically recalculated."],
                  ["UC16: View Executive KPIs", "Administrator", "Admin authenticated & approved", "Admin opens `/admin` dashboard; backend aggregates metrics.", "Live metrics displayed: Total Orders, Revenue (₹), Products, Pending Orders, Low-Stock alerts."],
                  ["UC17: Manage Products & Stock", "Administrator", "Admin authenticated & approved", "Admin executes CRUD operations on chocolates: updates price, batch stock, weights, and bestseller tags.", "Product catalog updated; out-of-stock items auto-flagged is_available=False."],
                  ["UC19: Fulfill Orders", "Administrator", "Orders exist in system", "Admin inspects order items and updates fulfillment pipeline: Pending → Confirmed → Preparing → Shipped → Delivered.", "Order status updated; automated in-app notification sent to customer."],
                  ["UC22: Approve Admin Applicants", "Super Admin Exclusive", "Logged in as admin@cocoabliss.com", "Super Admin visits `/admin/customers`, reviews pending applicant, and clicks 'Approve' or 'Reject'.", "Applicant promoted to is_staff=True, admin_status='approved', and notification dispatched."]
              ],
              col_widths=[1.5, 1.2, 1.2, 1.5, 1.1])
    
    doc.add_page_break()
    
    # =========================================================================
    # SECTION 2: ACTIVITY DIAGRAM – USER SIDE (PDF Page 2)
    # =========================================================================
    add_styled_heading(doc, "Section 2: Activity Diagram – User Side (System Design PDF Page 2)", level=1)
    
    doc.add_paragraph(
        "A UML Activity Diagram models the dynamic operational workflow of a system. It details the step-by-step sequencing, "
        "branching choices, swimlanes, and synchronization conditions of a user journey."
    )
    
    add_styled_heading(doc, "2.1 Forensic Analysis & Flaws of Original PDF Page 2", level=2)
    add_callout(doc, "Defects Identified in System Design PDF (Page 2)",
                "1. The Waterfall Conveyor-Belt Anti-Pattern: The original PDF models customer interaction as a single unbroken linear chain: "
                "Open Website → Register/Login → Browse → Search → View Details → Add to Cart → View Cart → Checkout → Payment → "
                "Place Order → View Order Details → Track Order → View History → Give Review → Manage Profile → Logout → End!\n"
                "2. Absurd Operational Preconditions: Under this linear model, a customer cannot track an existing order, update their profile, "
                "or browse chocolates without first placing an order and reviewing it! Every customer session is forced to terminate in Logout.\n"
                "3. Conflated Authentication Step: Registration and Login are collapsed into an ambiguous 'Register / Login' single node, "
                "failing to provide distinct paths for new visitor registration versus returning customer authentication.",
                border_color="B91C1C", bg_color="FEF2F2", icon="[CRITICAL FLAW]")
    
    add_styled_heading(doc, "2.2 Evaluation of User's Redrawn Customer Activity Diagram (Attached Image 4)", level=2)
    add_callout(doc, "Audit of User's Redrawn Attempt (Image 4) — The Fatal Fork/Join Concurrency Blunder",
                "PROS / STRENGTHS:\n"
                "• Correctly introduced a decision diamond ('Have an account?') at the entry point to separate Registration and Login.\n"
                "• Recognized that a customer can choose from multiple features on the dashboard.\n\n"
                "FATAL UML SYNTAX ERROR (MISUSE OF FORK AND JOIN BARS):\n"
                "• In Image 4, right below 'User Dashboard / Home Page', the user drew a solid black horizontal FORK BAR that splits into 7 parallel vertical paths "
                "(Browse Products, Search Product, Manage Cart, Place Order, Track Orders, Write Review, Manage Profile), "
                "and joined them all into a JOIN BAR right before 'Logout'!\n"
                "• Under the OMG UML 2.5 Specification (§15.3.3):\n"
                "  - A FORK NODE splits a single control token into multiple CONCURRENT tokens that execute IN PARALLEL.\n"
                "  - A JOIN NODE is a synchronization barrier that BLOCKS and CANNOT proceed until EVERY SINGLE incoming branch has completed!\n"
                "• Consequently, the user's diagram literally specifies that every single customer must simultaneously browse, search, edit cart, "
                "place an order, track delivery, write a review, and edit their password in parallel threads, and CANNOT LOG OUT until all 7 parallel threads finish!\n"
                "• This is a catastrophic conceptual blunder. In UI design, dashboard modules are MUTUALLY EXCLUSIVE ALTERNATIVE CHOICES, "
                "which MUST be modeled with a Decision Node (diamond), NOT a Fork/Join concurrency bar!\n\n"
                "ADDITIONAL LOGICAL FLAWS:\n"
                "• Branch 4 ('Place Order') is isolated from the Cart. In e-commerce, checkout is impossible without items in the cart.\n"
                "• Guest browsing is prevented; users are forced to register/login before browsing.",
                border_color="B91C1C", bg_color="FEF2F2", icon="[FATAL UML ERROR]")
    
    add_styled_heading(doc, "2.3 Replacement Matrix: User Side Activity Diagram", level=2)
    add_table(doc,
              ["Workflow Element", "Original PDF Page 2", "User Redraw (Image 4)", "Corrected Cocoa Bliss Architecture"],
              [
                  ["Storefront Entry & Guest Access", "Forced to 'Register / Login' immediately upon opening site.", "Forced to choose Register vs Login after home page.", "Permits full guest exploration of chocolate catalog; authentication requested at checkout."],
                  ["Dashboard Navigation Architecture", "Single continuous waterfall pipeline.", "FATAL: Concurrency Fork/Join bar across 7 parallel lanes.", "UML Decision Node (Choice diamond) inside an interactive session loop; user returns to navigation after actions."],
                  ["Cart & Checkout Flow", "View Cart → Checkout → Address → Payment (Linear).", "Place Order separated into independent branch without cart dependency.", "Cart review includes free-shipping threshold check (≥ ₹999); checkout requires populated cart."],
                  ["Order Tracking & Review", "Forced to track order and submit review immediately after purchase.", "Track Orders and Write Review forced to run concurrently with placing order.", "Customer selectively inspects order history, views 5-stage live timeline, prints GST invoice, and optionally reviews delivered chocolates."],
                  ["Session Termination", "Forced logout at end of every order.", "Logout blocked until all 7 concurrent paths complete.", "Customer terminates session at will via Logout decision; session token cleared."]
              ],
              col_widths=[1.5, 1.6, 1.6, 1.8])
    
    add_styled_heading(doc, "2.4 Corrected Cocoa Bliss Customer Activity Diagram", level=2)
    add_figure(doc, os.path.join(IMG_DIR, "corrected_user_activity_diagram.png"),
               "Figure 2.1: Corrected UML 2.5 Customer Activity Diagram with Decision-Loop Architecture & Swimlanes", width_in=6.2)
    
    add_styled_heading(doc, "2.5 Comparison with User's Redrawn Customer Activity Diagram", level=2)
    add_figure(doc, os.path.join(IMG_DIR, "user_redraw_customer_activity.jpg"),
               "Figure 2.2: Client/Student Redrawn Customer Activity Diagram (Demonstrating the Fatal Concurrency Fork/Join Blunder)", width_in=4.8)
    
    doc.add_page_break()
    
    # =========================================================================
    # SECTION 3: ACTIVITY DIAGRAM – ADMIN SIDE (PDF Page 3)
    # =========================================================================
    add_styled_heading(doc, "Section 3: Activity Diagram – Admin Side (System Design PDF Page 3)", level=1)
    
    add_styled_heading(doc, "3.1 Forensic Analysis & Flaws of Original PDF Page 3", level=2)
    add_callout(doc, "Defects Identified in System Design PDF (Page 3)",
                "1. Monolithic Conveyor Belt: The original diagram forces the administrator to execute every single administrative function in a strict, linear pipeline: "
                "Admin Login → Open Dashboard → Manage Users → Manage Categories → Manage Products → Add/Update/Delete Products → "
                "Manage Orders → Update Order Status → Manage Reviews → View Reports → Logout → End!\n"
                "2. Real-World Infeasibility: In reality, an administrator logs in to perform specific, isolated tasks (e.g., fulfilling pending orders, "
                "updating inventory for low-stock chocolates, or moderating reviews). No admin portal operates as a single linear pipeline through all modules.",
                border_color="B91C1C", bg_color="FEF2F2", icon="[CRITICAL FLAW]")
    
    add_styled_heading(doc, "3.2 Evaluation of User's Redrawn Admin Activity Diagram (Attached Image 3)", level=2)
    add_callout(doc, "Audit of User's Redrawn Attempt (Image 3)",
                "PROS / STRENGTHS:\n"
                "• Added granular CRUD sub-steps under each admin domain.\n\n"
                "CRITICAL ERRORS INTRODUCED:\n"
                "1. Identical Concurrency Fork/Join Blunder: The user repeated the fatal syntax error from Image 4 by placing a heavy FORK BAR "
                "after 'Admin Dashboard' and a JOIN BAR before 'Logout' across 6 parallel branches (Users, Products, Categories, Orders, Reviews, Reports). "
                "This syntactically mandates that an administrator must perform user management, product editing, category changes, order updates, "
                "review approvals, and sales reports simultaneously in parallel and cannot log out until all 6 complete!\n"
                "2. Omission of the Super Admin Approval Architecture: In Cocoa Bliss, users can register as administrators, but they are created with "
                "admin_status='pending' and is_staff=False. Only the primary Super Admin (admin@cocoabliss.com) can approve them. "
                "The user's diagram ignored this signature security feature and drew generic 'Add/Edit/Delete User'.",
                border_color="B91C1C", bg_color="FEF2F2", icon="[FATAL UML ERROR]")
    
    add_styled_heading(doc, "3.3 Replacement Matrix: Admin Side Activity Diagram", level=2)
    add_table(doc,
              ["Administrative Feature", "PDF Page 3 (Original)", "User Redraw (Image 3)", "Corrected Cocoa Bliss Architecture"],
              [
                  ["Admin Authentication & Gatekeeping", "Simple Login Successful? check.", "Email/Password with error loop.", "Two-tier verification: Checks valid credentials, role='admin', and admin_status='approved'. Pending applicants receive 403 screen."],
                  ["Admin Operational Structure", "Strict linear conveyor belt through all modules.", "Fork/Join concurrency bar forcing parallel execution.", "Interactive Decision Menu Node; administrator selects any module, performs actions, and loops back to Dashboard."],
                  ["Inventory & Stock Management", "Lumped into general product management.", "Add/Edit/Delete Product.", "Product & Stock Suite: batch stock adjustments, low-stock threshold indicators, automatic is_available toggling if stock=0."],
                  ["Order Fulfillment Pipeline", "Update Order Status (single box).", "View Orders → Update Status → View Details.", "5-Stage order fulfillment pipeline (Pending → Confirmed → Preparing → Shipped → Delivered) with real-time customer notifications."],
                  ["User Management & Approvals", "Manage Users (generic).", "View Users → Add/Edit/Delete User.", "Customer Directory with lifetime spend metrics + Super Admin 1-click applicant review & approval pipeline."]
              ],
              col_widths=[1.5, 1.6, 1.6, 1.8])
    
    add_styled_heading(doc, "3.4 Corrected Cocoa Bliss Administrator Activity Diagram", level=2)
    add_figure(doc, os.path.join(IMG_DIR, "corrected_admin_activity_diagram.png"),
               "Figure 3.1: Corrected UML 2.5 Administrator Activity Diagram featuring Decision-Loop & Super Admin Approval Gates", width_in=6.2)
    
    add_styled_heading(doc, "3.5 Comparison with User's Redrawn Admin Activity Diagram", level=2)
    add_figure(doc, os.path.join(IMG_DIR, "user_redraw_admin_activity.jpg"),
               "Figure 3.2: Client/Student Redrawn Admin Activity Diagram (Demonstrating the Concurrency Fork/Join Blunder)", width_in=4.8)
    
    doc.add_page_break()
    
    # =========================================================================
    # SECTION 4: CLASS DIAGRAM (PDF Page 4 Top)
    # =========================================================================
    add_styled_heading(doc, "Section 4: Class Diagram (System Design PDF Page 4 Top)", level=1)
    
    add_styled_heading(doc, "4.1 Forensic Analysis & Flaws of Original PDF Page 4 Top", level=2)
    add_callout(doc, "Defects Identified in System Design PDF (Page 4 Top)",
                "1. Relational Database Schema Masquerading as a UML Class Diagram: The diagram lists physical SQL database column definitions "
                "such as `user_id : int (PK)`, `email : varchar (Unique)`, `category_id : int (FK)`, and even includes a legend for PK/FK! "
                "In Object-Oriented UML, classes represent domain abstractions, NOT physical database tables. Foreign keys DO NOT exist as attributes in UML.\n"
                "2. Physical SQL Data Types: Uses relational engine types (`varchar`, `text`, `datetime`, `decimal`) rather than standard UML primitive types (`String`, `Integer`, `Decimal`, `DateTime`, `Boolean`).\n"
                "3. Missing Domain Classes: Completely omits `Wishlist`, `WishlistItem`, and `Notification`.",
                border_color="B91C1C", bg_color="FEF2F2", icon="[CRITICAL FLAW]")
    
    add_styled_heading(doc, "4.2 Evaluation of User's Redrawn Class Diagram (Attached Image 2)", level=2)
    add_callout(doc, "Audit of User's Redrawn Attempt (Image 2)",
                "PROS / STRENGTHS:\n"
                "• Replaced explicit SQL tags (PK/FK) with standard types (int, String, Decimal, DateTime).\n"
                "• Added methods to class definitions (e.g., register(), login(), placeOrder(), getSubTotal()).\n\n"
                "REMAINING CONCEPTUAL DEFECTS:\n"
                "1. Retention of Relational Foreign Keys: The user STILL retained foreign key attributes inside the class definitions "
                "(e.g., `userId: int` in Cart, `cartId: int` and `productId: int` in CartItem, `categoryId: int` in Product, `orderId: int` in OrderItem). "
                "In UML class modeling, relationships between objects are modeled via ASSOCIATIONS and COMPOSITIONS, not integer FK attributes!\n"
                "2. Active Record & Single Responsibility Violations: Placed administrative persistence operations directly on entity objects "
                "(e.g., `Product` has `addProduct()`, `updateProduct()`, `deleteProduct()`; `Category` has `addCategory()`, `deleteCategory()`). "
                "In object-oriented domain modeling, an individual chocolate bar instance does not add or delete itself from the catalog!\n"
                "3. Incorrect Relationship Semantics: Used simple directed arrows instead of UML Composition (filled black diamond `◆---`) "
                "between Order and OrderItem, and Cart and CartItem.",
                border_color="D97706", bg_color="FFFBEB", icon="[REDRAW EVALUATION]")
    
    add_styled_heading(doc, "4.3 Replacement Matrix: UML Class Diagram", level=2)
    add_table(doc,
              ["Class Diagram Element", "PDF Page 4 Top (Original)", "User Redraw (Image 2)", "Corrected Cocoa Bliss Architecture"],
              [
                  ["Attribute Typing", "SQL types (varchar, text, int PK/FK)", "Primitive types (int, String, Decimal)", "Standard UML 2.5 types (String, Integer, Decimal, Boolean, DateTime) with UML visibility (+/-)."],
                  ["Relational Foreign Keys", "Explicitly written as `field_name (FK)`", "Retained as `userId: int`, `productId: int`", "Completely purged from attributes; expressed purely through associations and compositions."],
                  ["Object Lifecycles", "Simple association lines with text labels", "Simple directed association arrows", "Strict UML Compositions (◆---) for Order ◆--- 1..* OrderItem, Cart ◆--- 0..* CartItem, and Wishlist ◆--- 0..* WishlistItem."],
                  ["Class Responsibilities", "Methods missing entirely", "Entity CRUD (Product.addProduct())", "Domain business methods (e.g., checkAvailability(), deductStock(), calculateSubtotal(), isLowStock())."],
                  ["System Completeness", "Omitted Wishlist & Notifications", "Omitted Wishlist & Notifications", "Full inclusion of all 12 domain entities including Wishlist, WishlistItem, and Notification."]
              ],
              col_widths=[1.5, 1.6, 1.6, 1.8])
    
    add_styled_heading(doc, "4.4 Corrected Cocoa Bliss UML Class Diagram", level=2)
    add_figure(doc, os.path.join(IMG_DIR, "corrected_class_diagram.png"),
               "Figure 4.1: Corrected UML 2.5 Object-Oriented Domain Class Diagram (Free of Relational FKs with Domain Compositions)", width_in=6.2)
    
    add_styled_heading(doc, "4.5 Comparison with User's Redrawn Class Diagram", level=2)
    add_figure(doc, os.path.join(IMG_DIR, "user_redraw_class_diagram.jpg"),
               "Figure 4.2: Client/Student Redrawn Class Diagram (Evaluated for Residual Foreign Keys & Active Record CRUD Methods)", width_in=5.8)
    
    doc.add_page_break()
    
    # =========================================================================
    # SECTION 5: DATABASE DESIGN & RELATIONAL SCHEMA (PDF Pages 4, 5, 6)
    # =========================================================================
    add_styled_heading(doc, "Section 5: Database Design & Relational Schema (PDF Pages 4, 5, 6)", level=1)
    
    doc.add_paragraph(
        "The Cocoa Bliss persistence layer is engineered as a robust Third Normal Form (3NF) relational database. "
        "It supports high-concurrency e-commerce operations, historical financial immutability, relational integrity constraints, "
        "and seamless portability between MySQL (production/demonstration) and SQLite (development fallback)."
    )
    
    add_styled_heading(doc, "5.1 Critical Data Integrity Flaws in Original PDF Schema", level=2)
    add_callout(doc, "Data Integrity Hazards Identified in PDF Database Design",
                "1. The Historical Mutation Disaster in `OrderItem`:\n"
                "   - The PDF schema defines `order_item` with only `product_id` and `price`.\n"
                "   - CRITICAL FLAW: If an administrator subsequently updates a chocolate's name, alters its weight packaging, "
                "or discontinues and deletes a seasonal chocolate, all historical order records and printable GST tax invoices are either "
                "retroactively mutated or broken by foreign key cascade failures!\n"
                "   - CORRECTION: `OrderItem` must store immutable snapshots: `product_name_snapshot`, `product_image_snapshot`, "
                "`product_weight_snapshot`, and `unit_price`, with `product_id` set to `ON DELETE SET NULL`.\n"
                "2. Missing Delivery Charge Breakdown:\n"
                "   - Cocoa Bliss enforces free shipping on orders ≥ ₹999, while charging ₹99 for orders below. "
                "The PDF `order` table only stored `total_amount`, making GST invoice auditing and shipping fee accounting impossible.\n"
                "3. Completely Missing Relational Tables:\n"
                "   - The PDF completely omitted `wishlists`, `wishlist_items`, and `notifications`, despite their full presence in the codebase.",
                border_color="B91C1C", bg_color="FEF2F2", icon="[DATABASE DEFECT]")
    
    add_styled_heading(doc, "5.2 Complete Production Relational Tables (Tables 2.1 to 2.12)", level=2)
    
    # Table 2.1 User Table
    doc.add_paragraph("Table 2.1: User Table (`users`)").paragraph_format.space_before = Pt(6)
    add_table(doc,
              ["Field Name", "Data Type", "Constraint", "Default", "Description"],
              [
                  ["user_id", "INT AUTO_INCREMENT", "PRIMARY KEY", "—", "Unique identifier for customer or administrator."],
                  ["email", "VARCHAR(100)", "UNIQUE, NOT NULL", "—", "Registered email address used as login username."],
                  ["name", "VARCHAR(150)", "NOT NULL", "—", "Customer's full legal name."],
                  ["phone", "VARCHAR(20)", "NULLABLE", "NULL", "Primary contact mobile number."],
                  ["password", "VARCHAR(255)", "NOT NULL", "—", "Cryptographic password hash (PBKDF2 SHA-256)."],
                  ["address", "TEXT", "NULLABLE", "NULL", "Street delivery address."],
                  ["city", "VARCHAR(100)", "NULLABLE", "NULL", "Delivery city."],
                  ["state", "VARCHAR(100)", "NULLABLE", "NULL", "Delivery state/province."],
                  ["postal_code", "VARCHAR(20)", "NULLABLE", "NULL", "Postal / PIN code."],
                  ["country", "VARCHAR(100)", "NOT NULL", "'India'", "Country of residence."],
                  ["role", "VARCHAR(20)", "NOT NULL", "'customer'", "Access role: 'customer' or 'admin'."],
                  ["admin_status", "VARCHAR(20)", "NOT NULL", "'none'", "Approval state: 'none', 'pending', 'approved', 'rejected'."],
                  ["is_staff", "BOOLEAN", "NOT NULL", "FALSE", "Django staff permission flag; TRUE only when admin_status='approved'."],
                  ["created_at", "DATETIME", "NOT NULL", "CURRENT_TIMESTAMP", "Timestamp of account registration."]
              ],
              col_widths=[1.3, 1.4, 1.2, 1.0, 1.8])
    
    # Table 2.2 Category Table
    doc.add_paragraph("Table 2.2: Category Table (`categories`)").paragraph_format.space_before = Pt(6)
    add_table(doc,
              ["Field Name", "Data Type", "Constraint", "Default", "Description"],
              [
                  ["category_id", "INT AUTO_INCREMENT", "PRIMARY KEY", "—", "Unique identifier for chocolate category."],
                  ["name", "VARCHAR(100)", "UNIQUE, NOT NULL", "—", "Category title (e.g., 'Dark Chocolates', 'Truffles')."],
                  ["slug", "VARCHAR(120)", "UNIQUE, NOT NULL", "—", "URL-safe slug for storefront routing (e.g., 'dark-chocolates')."],
                  ["description", "TEXT", "NULLABLE", "NULL", "Detailed overview of the collection."],
                  ["image_url", "VARCHAR(500)", "NULLABLE", "NULL", "Banner image asset URL."],
                  ["is_active", "BOOLEAN", "NOT NULL", "TRUE", "Visibility flag for storefront catalog."],
                  ["created_at", "DATETIME", "NOT NULL", "CURRENT_TIMESTAMP", "Timestamp of category creation."]
              ],
              col_widths=[1.3, 1.4, 1.2, 1.0, 1.8])
    
    # Table 2.3 Product Table
    doc.add_paragraph("Table 2.3: Product Table (`products`)").paragraph_format.space_before = Pt(6)
    add_table(doc,
              ["Field Name", "Data Type", "Constraint", "Default", "Description"],
              [
                  ["product_id", "INT AUTO_INCREMENT", "PRIMARY KEY", "—", "Unique identifier for chocolate product."],
                  ["category_id", "INT", "FOREIGN KEY", "—", "References `categories(category_id)` ON DELETE RESTRICT."],
                  ["name", "VARCHAR(200)", "NOT NULL", "—", "Commercial product name (e.g., 'Assorted Chocolate Box')."],
                  ["slug", "VARCHAR(220)", "UNIQUE, NOT NULL", "—", "URL slug for product detail page."],
                  ["short_description", "VARCHAR(255)", "NULLABLE", "NULL", "Brief card summary."],
                  ["description", "TEXT", "NOT NULL", "—", "Comprehensive artisanal description."],
                  ["ingredients", "TEXT", "NOT NULL", "—", "Detailed list of pure ingredients and allergens."],
                  ["price", "DECIMAL(10,2)", "NOT NULL", "—", "Selling price in INR (₹)."],
                  ["original_price", "DECIMAL(10,2)", "NULLABLE", "NULL", "Strikethrough MRP for discounts."],
                  ["weight", "VARCHAR(50)", "NOT NULL", "'150g'", "Packaging net weight (e.g., '150g', '250g', '500g')."],
                  ["image_url", "VARCHAR(500)", "NOT NULL", "—", "Product showcase image URL."],
                  ["stock_quantity", "INT UNSIGNED", "NOT NULL", "25", "Live inventory count in units."],
                  ["is_available", "BOOLEAN", "NOT NULL", "TRUE", "Availability flag (automatically FALSE if stock=0)."],
                  ["is_bestseller", "BOOLEAN", "NOT NULL", "FALSE", "Displays on homepage 'Best Sellers' showcase."],
                  ["is_featured", "BOOLEAN", "NOT NULL", "FALSE", "Featured collection promotion."],
                  ["rating", "DECIMAL(3,1)", "NOT NULL", "5.0", "Denormalized average review rating (1.0–5.0)."],
                  ["review_count", "INT UNSIGNED", "NOT NULL", "0", "Total approved customer reviews."],
                  ["created_at", "DATETIME", "NOT NULL", "CURRENT_TIMESTAMP", "Timestamp of product creation."],
                  ["updated_at", "DATETIME", "NOT NULL", "CURRENT_TIMESTAMP", "Timestamp of last modification."]
              ],
              col_widths=[1.3, 1.4, 1.2, 1.0, 1.8])
    
    # Table 2.4 Cart Table
    doc.add_paragraph("Table 2.4: Cart Table (`carts`)").paragraph_format.space_before = Pt(6)
    add_table(doc,
              ["Field Name", "Data Type", "Constraint", "Default", "Description"],
              [
                  ["cart_id", "INT AUTO_INCREMENT", "PRIMARY KEY", "—", "Unique shopping cart identifier."],
                  ["user_id", "INT", "FOREIGN KEY, UNIQUE", "—", "References `users(user_id)` ON DELETE CASCADE (1-to-1)."],
                  ["created_at", "DATETIME", "NOT NULL", "CURRENT_TIMESTAMP", "Timestamp of cart initialization."],
                  ["updated_at", "DATETIME", "NOT NULL", "CURRENT_TIMESTAMP", "Timestamp of last cart update."]
              ],
              col_widths=[1.3, 1.4, 1.2, 1.0, 1.8])
    
    # Table 2.5 Cart Item Table
    doc.add_paragraph("Table 2.5: Cart Item Table (`cart_items`)").paragraph_format.space_before = Pt(6)
    add_table(doc,
              ["Field Name", "Data Type", "Constraint", "Default", "Description"],
              [
                  ["cart_item_id", "INT AUTO_INCREMENT", "PRIMARY KEY", "—", "Unique cart line-item identifier."],
                  ["cart_id", "INT", "FOREIGN KEY", "—", "References `carts(cart_id)` ON DELETE CASCADE."],
                  ["product_id", "INT", "FOREIGN KEY", "—", "References `products(product_id)` ON DELETE CASCADE."],
                  ["quantity", "INT UNSIGNED", "NOT NULL", "1", "Selected purchase quantity."],
                  ["UNIQUE(cart_id, product_id)", "COMPOSITE UNIQUE", "—", "—", "Prevents duplicate line items; enforces quantity increment."]
              ],
              col_widths=[1.3, 1.4, 1.2, 1.0, 1.8])
    
    # Table 2.6 Order Table
    doc.add_paragraph("Table 2.6: Order Table (`orders`)").paragraph_format.space_before = Pt(6)
    add_table(doc,
              ["Field Name", "Data Type", "Constraint", "Default", "Description"],
              [
                  ["order_id", "INT AUTO_INCREMENT", "PRIMARY KEY", "—", "Internal relational order ID."],
                  ["order_number", "VARCHAR(50)", "UNIQUE, NOT NULL", "—", "Public tracking ID (e.g., 'CB-2026-98124')."],
                  ["user_id", "INT", "FOREIGN KEY", "—", "References `users(user_id)` ON DELETE RESTRICT."],
                  ["customer_name", "VARCHAR(150)", "NOT NULL", "—", "Snapshot of recipient full name."],
                  ["customer_email", "VARCHAR(100)", "NOT NULL", "—", "Snapshot of customer email address."],
                  ["customer_phone", "VARCHAR(20)", "NOT NULL", "—", "Snapshot of contact phone number."],
                  ["shipping_address", "TEXT", "NOT NULL", "—", "Snapshot of delivery address."],
                  ["city", "VARCHAR(100)", "NOT NULL", "—", "Delivery destination city."],
                  ["state", "VARCHAR(100)", "NOT NULL", "—", "Delivery destination state."],
                  ["postal_code", "VARCHAR(20)", "NOT NULL", "—", "Delivery PIN code."],
                  ["subtotal", "DECIMAL(10,2)", "NOT NULL", "—", "Sum of line item totals."],
                  ["delivery_charge", "DECIMAL(10,2)", "NOT NULL", "0.00", "Shipping fee (₹0 if subtotal ≥ ₹999, else ₹99)."],
                  ["total_amount", "DECIMAL(10,2)", "NOT NULL", "—", "Final payable amount (subtotal + delivery_charge)."],
                  ["payment_method", "VARCHAR(20)", "NOT NULL", "'cod'", "'cod' (Cash on Delivery), 'upi', or 'card'."],
                  ["payment_status", "VARCHAR(20)", "NOT NULL", "'pending'", "'pending', 'completed', or 'failed'."],
                  ["order_status", "VARCHAR(20)", "NOT NULL", "'pending'", "'pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'."],
                  ["created_at", "DATETIME", "NOT NULL", "CURRENT_TIMESTAMP", "Timestamp of order placement."],
                  ["updated_at", "DATETIME", "NOT NULL", "CURRENT_TIMESTAMP", "Timestamp of latest fulfillment status update."]
              ],
              col_widths=[1.3, 1.4, 1.2, 1.0, 1.8])
    
    # Table 2.7 Order Item Table
    doc.add_paragraph("Table 2.7: Order Item Table (`order_items`) — Features Historical Immutability Snapshots").paragraph_format.space_before = Pt(6)
    add_table(doc,
              ["Field Name", "Data Type", "Constraint", "Default", "Description"],
              [
                  ["order_item_id", "INT AUTO_INCREMENT", "PRIMARY KEY", "—", "Unique order item identifier."],
                  ["order_id", "INT", "FOREIGN KEY", "—", "References `orders(order_id)` ON DELETE CASCADE."],
                  ["product_id", "INT", "FOREIGN KEY, NULLABLE", "NULL", "References `products(product_id)` ON DELETE SET NULL."],
                  ["product_name_snapshot", "VARCHAR(200)", "NOT NULL", "—", "Permanent snapshot of chocolate name at time of order."],
                  ["product_image_snapshot", "VARCHAR(500)", "NULLABLE", "NULL", "Snapshot of image asset URL."],
                  ["product_weight_snapshot", "VARCHAR(50)", "NOT NULL", "'150g'", "Snapshot of package weight at purchase."],
                  ["unit_price", "DECIMAL(10,2)", "NOT NULL", "—", "Immutable purchase price per unit."],
                  ["quantity", "INT UNSIGNED", "NOT NULL", "1", "Number of units purchased."],
                  ["subtotal", "DECIMAL(10,2)", "NOT NULL", "—", "Line total (unit_price * quantity)."]
              ],
              col_widths=[1.4, 1.4, 1.2, 0.9, 1.8])
    
    # Table 2.8 Payment Table
    doc.add_paragraph("Table 2.8: Payment Table (`payments`)").paragraph_format.space_before = Pt(6)
    add_table(doc,
              ["Field Name", "Data Type", "Constraint", "Default", "Description"],
              [
                  ["payment_id", "INT AUTO_INCREMENT", "PRIMARY KEY", "—", "Unique payment transaction identifier."],
                  ["order_id", "INT", "FOREIGN KEY, UNIQUE", "—", "References `orders(order_id)` ON DELETE CASCADE (1-to-1)."],
                  ["amount", "DECIMAL(10,2)", "NOT NULL", "—", "Transaction amount in INR (₹)."],
                  ["payment_method", "VARCHAR(50)", "NOT NULL", "—", "Payment provider ('Cash on Delivery', 'UPI / Razorpay', 'Credit Card')."],
                  ["payment_status", "VARCHAR(30)", "NOT NULL", "'pending'", "'pending', 'completed', 'refunded', 'failed'."],
                  ["transaction_reference", "VARCHAR(100)", "NULLABLE", "NULL", "External gateway transaction/reference ID."],
                  ["payment_date", "DATETIME", "NOT NULL", "CURRENT_TIMESTAMP", "Timestamp of payment transaction."]
              ],
              col_widths=[1.3, 1.4, 1.2, 1.0, 1.8])
    
    # Table 2.9 Review Table
    doc.add_paragraph("Table 2.9: Review Table (`reviews`)").paragraph_format.space_before = Pt(6)
    add_table(doc,
              ["Field Name", "Data Type", "Constraint", "Default", "Description"],
              [
                  ["review_id", "INT AUTO_INCREMENT", "PRIMARY KEY", "—", "Unique product review identifier."],
                  ["user_id", "INT", "FOREIGN KEY", "—", "References `users(user_id)` ON DELETE CASCADE."],
                  ["product_id", "INT", "FOREIGN KEY", "—", "References `products(product_id)` ON DELETE CASCADE."],
                  ["rating", "TINYINT UNSIGNED", "NOT NULL", "5", "Customer rating scale from 1 to 5 stars."],
                  ["comment", "TEXT", "NOT NULL", "—", "Written customer tasting review."],
                  ["created_at", "DATETIME", "NOT NULL", "CURRENT_TIMESTAMP", "Timestamp of review submission."]
              ],
              col_widths=[1.3, 1.4, 1.2, 1.0, 1.8])
    
    # Table 2.10 Wishlist Table (Missing in PDF)
    doc.add_paragraph("Table 2.10: Wishlist Table (`wishlists`) — Fully Implemented System Entity").paragraph_format.space_before = Pt(6)
    add_table(doc,
              ["Field Name", "Data Type", "Constraint", "Default", "Description"],
              [
                  ["wishlist_id", "INT AUTO_INCREMENT", "PRIMARY KEY", "—", "Unique wishlist identifier."],
                  ["user_id", "INT", "FOREIGN KEY, UNIQUE", "—", "References `users(user_id)` ON DELETE CASCADE (1-to-1)."],
                  ["created_at", "DATETIME", "NOT NULL", "CURRENT_TIMESTAMP", "Timestamp of wishlist creation."]
              ],
              col_widths=[1.3, 1.4, 1.2, 1.0, 1.8])
    
    # Table 2.11 Wishlist Item Table (Missing in PDF)
    doc.add_paragraph("Table 2.11: Wishlist Item Table (`wishlist_items`) — Fully Implemented System Entity").paragraph_format.space_before = Pt(6)
    add_table(doc,
              ["Field Name", "Data Type", "Constraint", "Default", "Description"],
              [
                  ["wishlist_item_id", "INT AUTO_INCREMENT", "PRIMARY KEY", "—", "Unique wishlist item identifier."],
                  ["wishlist_id", "INT", "FOREIGN KEY", "—", "References `wishlists(wishlist_id)` ON DELETE CASCADE."],
                  ["product_id", "INT", "FOREIGN KEY", "—", "References `products(product_id)` ON DELETE CASCADE."],
                  ["created_at", "DATETIME", "NOT NULL", "CURRENT_TIMESTAMP", "Timestamp added to wishlist."],
                  ["UNIQUE(wishlist_id, product_id)", "COMPOSITE UNIQUE", "—", "—", "Prevents duplicate entries of same product in wishlist."]
              ],
              col_widths=[1.3, 1.4, 1.2, 1.0, 1.8])
    
    # Table 2.12 Notification Table (Missing in PDF)
    doc.add_paragraph("Table 2.12: Notification Table (`notifications`) — Fully Implemented System Entity").paragraph_format.space_before = Pt(6)
    add_table(doc,
              ["Field Name", "Data Type", "Constraint", "Default", "Description"],
              [
                  ["notification_id", "INT AUTO_INCREMENT", "PRIMARY KEY", "—", "Unique notification identifier."],
                  ["user_id", "INT", "FOREIGN KEY", "—", "References `users(user_id)` ON DELETE CASCADE."],
                  ["title", "VARCHAR(200)", "NOT NULL", "—", "Brief notification headline (e.g., 'Order Shipped!')."],
                  ["message", "TEXT", "NOT NULL", "—", "Detailed message body with status updates."],
                  ["link", "VARCHAR(255)", "NULLABLE", "NULL", "Direct internal route link (e.g., '/orders/CB-2026-98124')."],
                  ["is_read", "BOOLEAN", "NOT NULL", "FALSE", "Read status flag."],
                  ["created_at", "DATETIME", "NOT NULL", "CURRENT_TIMESTAMP", "Timestamp of notification dispatch."]
              ],
              col_widths=[1.3, 1.4, 1.2, 1.0, 1.8])
    
    add_styled_heading(doc, "5.3 Corrected Relational Database ERD", level=2)
    add_figure(doc, os.path.join(IMG_DIR, "corrected_database_erd.png"),
               "Figure 5.1: Complete 12-Table Entity-Relationship Diagram (ERD) with Referential Constraints & Historical Immutability", width_in=6.2)
    
    doc.add_page_break()
    
    # =========================================================================
    # SECTION 6: USER INTERFACE DESIGNS (PDF Pages 7, 8, 9, 10)
    # =========================================================================
    add_styled_heading(doc, "Section 6: User Interface Designs (PDF Pages 7, 8, 9, 10)", level=1)
    
    doc.add_paragraph(
        "The Cocoa Bliss user interface adheres to a tailored luxury chocolate confectionary design system. "
        "It combines an editorial typography hierarchy (Playfair Display for luxury serif headlines with Plus Jakarta Sans for readable body copy) "
        "with an artisanal color palette: Deep Cocoa (#1E0D06), Warm Caramel (#C68B59), Soft Canvas Cream (#FDFBF7), and Burgundy accents. "
        "The following sub-sections detail the four authentic UI screens presented in the System Design PDF, "
        "correlating each visual element directly with the system's underlying use cases, activity nodes, and database tables."
    )
    
    # Screen 1: Login Page
    add_styled_heading(doc, "6.1 Screen 1: Login Page (System Design PDF Page 7)", level=2)
    add_figure(doc, os.path.join(IMG_DIR, "ui_login_page.png"),
               "Figure 6.1: Cocoa Bliss Split-Screen Authentication — Login Page UI Design (PDF Page 7)", width_in=5.8)
    add_table(doc,
              ["UI Component / Widget", "Architectural Functionality", "Associated Backend Service & DB Entity"],
              [
                  ["Split-Screen Visual Showcase", "Left panel displays luxury chocolate assortment with branded typography: 'Welcome Back! Login to continue your Cocoa Bliss journey.'", "Static CDN / Vite asset packaging."],
                  ["Email & Password Inputs", "Interactive credentials inputs with show/hide password toggle button and client-side format validation.", "Maps to `users.email` and `users.password`. Verified via Django `authenticate()`."],
                  ["Forgot Password Link", "Directs user to password reset workflow.", "Triggers password recovery token."],
                  ["1-Click Quick Demo Fill", "Development convenience buttons to instantly populate Super Admin or Customer credentials.", "Seeds demo payload directly into React form state."],
                  ["Register Redirect Link", "'Don't have an account? Register Now' navigation link.", "Directs browser to `/register` route."]
              ],
              col_widths=[1.8, 2.7, 2.0])
    
    # Screen 2: Register Page
    add_styled_heading(doc, "6.2 Screen 2: Register Page (System Design PDF Page 8)", level=2)
    add_figure(doc, os.path.join(IMG_DIR, "ui_register_page.png"),
               "Figure 6.2: Cocoa Bliss Registration & Admin Application UI Design (PDF Page 8)", width_in=5.8)
    add_table(doc,
              ["UI Component / Widget", "Architectural Functionality", "Associated Backend Service & DB Entity"],
              [
                  ["Registration Form Grid", "Collects Full Name, Email Address, Phone Number, Password, Confirm Password, and Street Address.", "Validated via DRF `RegisterSerializer` and stored in `users` table."],
                  ["Role Dropdown Selector", "Allows applicants to select between 'Customer' (immediate access) and 'Administrator (Requires Super Admin Approval)'.", "If Admin selected, backend sets `role='customer'`, `admin_status='pending'`, and `is_staff=False`."],
                  ["Terms & Privacy Checkbox", "Legal compliance checkbox verifying acceptance of storefront terms.", "Client-side submission blocker."],
                  ["Quick Demo Fill Buttons", "Pre-fills demo customer or admin applicant profiles for testing.", "Populates demo applicant data into React form."]
              ],
              col_widths=[1.8, 2.7, 2.0])
    
    # Screen 3: Home Dashboard
    add_styled_heading(doc, "6.3 Screen 3: Home Dashboard / Storefront (System Design PDF Page 9)", level=2)
    add_figure(doc, os.path.join(IMG_DIR, "ui_home_dashboard.png"),
               "Figure 6.3: Cocoa Bliss Storefront Homepage & Best Sellers Carousel UI Design (PDF Page 9)", width_in=5.8)
    add_table(doc,
              ["UI Component / Widget", "Architectural Functionality", "Associated Backend Service & DB Entity"],
              [
                  ["Announcement Top Bar", "Displays contact helpline (+91 98765 43210), email support, and 'Free Shipping on Orders Above ₹999'.", "Dynamic threshold evaluator connected to Cart subtotal logic."],
                  ["Navigation Bar", "Logo, menu links (Home, Shop, Categories, Gift Boxes, About Us, Contact Us), search toggle, account icon, and live cart badge.", "Synced with `AuthContext`, `CartContext`, and `WishlistContext`."],
                  ["Hero Banner", "'INDULGE IN PURE HAPPINESS / Homemade Chocolates, Made with Love.' with CTA buttons ('SHOP NOW', 'EXPLORE GIFT BOXES').", "Directs customers to filtered catalog categories."],
                  ["Trust Feature Badges", "Highlights: Premium Ingredients, Handmade with Love, Fast & Reliable Delivery, Secure Payments, Beautiful Packaging.", "Brand credibility badges."],
                  ["Best Sellers Grid", "6-product showcase: Assorted Box (₹599), Dark Chocolate Bar (₹249), Hazelnut Truffles (₹399), Chocolate Almonds (₹349), Gift Box (₹899), Brownies (₹299).", "Queried from `products` where `is_bestseller=True`; 1-click 'ADD TO CART' syncs to `cart_items`."]
              ],
              col_widths=[1.8, 2.7, 2.0])
    
    # Screen 4: Admin Dashboard
    add_styled_heading(doc, "6.4 Screen 4: Admin Dashboard (System Design PDF Page 10)", level=2)
    add_figure(doc, os.path.join(IMG_DIR, "ui_admin_dashboard.png"),
               "Figure 6.4: Cocoa Bliss Executive Administrator Dashboard & KPI Suite UI Design (PDF Page 10)", width_in=5.8)
    add_table(doc,
              ["UI Component / Widget", "Architectural Functionality", "Associated Backend Service & DB Entity"],
              [
                  ["Executive KPI Metric Cards", "Real-time cards: Total Orders (248), Total Customers (532), Total Products (86), Total Revenue (₹1,24,860), Pending Orders (23).", "Aggregated from `orders`, `users`, and `products` tables via DRF analytics service."],
                  ["Sales Overview Graph", "Trend line chart tracking daily revenue and transaction volume across the current month.", "Computed from `orders.created_at` and `orders.total_amount`."],
                  ["Order Status Donut Chart", "Fulfillment breakdown: Delivered 118 (47.6%), Processing 67 (27.0%), Shipped 40 (16.1%), Pending 23 (9.3%).", "Aggregated from `orders.order_status`."],
                  ["Quick Actions & Navigation", "1-click actions: Add New Product, Add New Category, Manage Orders, Manage Users, View Reports.", "Routes to respective CRUD interfaces."],
                  ["Recent Orders Table", "Lists recent order numbers, customer names, dates, amounts, status badges, and action inspection button.", "Pulls from `orders` with pagination."],
                  ["Low Stock Alert Widget", "Flags items with depleted stock (e.g., Dark Chocolate Bar: 5, Hazelnut Truffles: 8, Chocolate Almonds: 8).", "Queried from `products` where `stock_quantity <= 10`."]
              ],
              col_widths=[1.8, 2.7, 2.0])
    
    # 6.5 System Traceability Matrix
    add_styled_heading(doc, "6.5 End-to-End System Traceability Matrix", level=2)
    doc.add_paragraph(
        "The following matrix establishes bidirectional traceability across every architectural tier: "
        "from the customer/admin User Interface screens, through UML Use Cases and Activity Diagram nodes, "
        "to the Object-Oriented Domain Classes and underlying Relational Database Tables."
    )
    add_table(doc,
              ["UI Screen / Page", "UML Use Cases", "Activity Diagram Flow", "Domain Class & Methods", "Database Tables"],
              [
                  ["Login Page\n(PDF Page 7)", "UC2: Login & Authentication", "Customer Activity:\nAction 'Enter Email & Password' → System Authenticate", "User:\n+ authenticate(): Token", "`users`"],
                  ["Register Page\n(PDF Page 8)", "UC1: Register / Apply Admin\nUC22: Approve Admin", "Customer Activity:\nAction 'Fill Registration' → Verify & Hash", "User:\n+ register(): Boolean\n+ approveAdmin(): Void", "`users`,\n`notifications`"],
                  ["Home Dashboard\n(PDF Page 9)", "UC3: Browse Catalog\nUC4: Filter Chocolates\nUC6: Manage Cart", "Customer Activity:\nStorefront Menu → Browse / Search → Add to Cart", "Product:\n+ checkAvailability()\nCart:\n+ calculateSubtotal()", "`categories`,\n`products`,\n`carts`,\n`cart_items`"],
                  ["Order Tracking &\nTax Invoice", "UC9: Track Order\nUC10: Download Invoice\nUC11: Submit Review", "Customer Activity:\nOrder History → 5-Stage Timeline → Print Invoice", "Order:\n+ updateStatus()\nReview:\n+ validateRating()", "`orders`,\n`order_items`,\n`reviews`"],
                  ["Admin Dashboard\n(PDF Page 10)", "UC16: View KPI Analytics\nUC17: Manage Products\nUC19: Fulfill Orders", "Admin Activity:\nDashboard → Module Selection Loop → Update Status", "Product:\n+ deductStock()\nOrder:\n+ updateStatus()", "`orders`,\n`order_items`,\n`products`,\n`categories`,\n`users`"]
              ],
              col_widths=[1.3, 1.4, 1.4, 1.2, 1.2])
    
    doc.save(DOCX_OUT)
    print(f"Document successfully created and saved to: {DOCX_OUT}")

if __name__ == "__main__":
    build_document()

"""
generate_all_diagrams.py
Generates 5 publication-quality, high-resolution UML and Database diagrams
for Cocoa Bliss E-Commerce Platform System Design.
"""

import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
import os

OUT_DIR = r"d:\PROJECTS\COCOA BLISS\system_design_diagrams"
os.makedirs(OUT_DIR, exist_ok=True)

# -------------------------------------------------------------
# Color Palette
# -------------------------------------------------------------
BG_COLOR = "#FFFFFF"
PRIMARY_COCOA = "#2A150D"
CARAMEL_ACCENT = "#C68B59"
LIGHT_CREAM = "#FDF8F3"
BORDER_COLOR = "#5C3A21"
TEXT_DARK = "#1E0D06"
MUTED_TEXT = "#555555"
BOX_FILL = "#FDFBF7"
ACCENT_GREEN = "#2E6930"
ACCENT_BLUE = "#1E40AF"
ACCENT_RED = "#991B1B"

# =============================================================
# 1. USE CASE DIAGRAM
# =============================================================
def generate_use_case_diagram():
    fig, ax = plt.subplots(figsize=(16, 12), dpi=300)
    ax.set_facecolor(BG_COLOR)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis("off")

    # Title
    ax.text(50, 97, "Cocoa Bliss — Corrected Use Case Diagram", 
            ha="center", va="center", fontsize=18, fontweight="bold", color=PRIMARY_COCOA)
    ax.text(50, 94.5, "(UML 2.5 Compliant E-Commerce Architecture with Super Admin Hierarchy & <<include>> / <<extend>> Relationships)", 
            ha="center", va="center", fontsize=10, fontstyle="italic", color=MUTED_TEXT)

    # System Boundary Box
    boundary = patches.FancyBboxPatch((18, 5), 64, 86, boxstyle="round,pad=0.5,rounding_size=1.0",
                                      edgecolor=PRIMARY_COCOA, facecolor="#FCFAF7", linewidth=2.5)
    ax.add_patch(boundary)
    ax.text(50, 88.5, "System Boundary: Cocoa Bliss Platform", ha="center", va="center", 
            fontsize=13, fontweight="bold", color=PRIMARY_COCOA)

    # Helper function to draw stick figure
    def draw_actor(x, y, label, sublabel=""):
        # Head
        circle = patches.Circle((x, y + 4), 1.6, edgecolor=PRIMARY_COCOA, facecolor="#FFF", linewidth=2)
        ax.add_patch(circle)
        # Body
        ax.plot([x, x], [y + 2.4, y - 2.5], color=PRIMARY_COCOA, lw=2.2)
        # Arms
        ax.plot([x - 2.8, x + 2.8], [y + 0.8, y + 0.8], color=PRIMARY_COCOA, lw=2.2)
        # Legs
        ax.plot([x, x - 2.2], [y - 2.5, y - 6.5], color=PRIMARY_COCOA, lw=2.2)
        ax.plot([x, x + 2.2], [y - 2.5, y - 6.5], color=PRIMARY_COCOA, lw=2.2)
        # Label
        ax.text(x, y - 8.2, label, ha="center", va="center", fontsize=11, fontweight="bold", color=PRIMARY_COCOA)
        if sublabel:
            ax.text(x, y - 10.2, sublabel, ha="center", va="center", fontsize=8.5, fontstyle="italic", color=MUTED_TEXT)

    # Helper function to draw use case oval
    def draw_use_case(x, y, text, width=17, height=3.4, fill="#FFF8F0", edge=BORDER_COLOR):
        ellipse = patches.Ellipse((x, y), width, height, facecolor=fill, edgecolor=edge, linewidth=1.5, zorder=3)
        ax.add_patch(ellipse)
        ax.text(x, y, text, ha="center", va="center", fontsize=8.5, fontweight="semibold", color=TEXT_DARK, zorder=4)

    # Draw Primary Actors
    draw_actor(8, 52, "Customer", "(Storefront User)")
    draw_actor(92, 65, "Administrator", "(Store Admin)")
    draw_actor(92, 28, "Super Admin", "(admin@cocoabliss.com)")
    
    # Actor generalization arrow (Super Admin inherits from Administrator)
    ax.annotate("", xy=(92, 53), xytext=(92, 38),
                arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.8, mutation_scale=15))
    ax.text(92.5, 45.5, "«inherits»", ha="left", va="center", fontsize=8, fontstyle="italic", color=PRIMARY_COCOA)

    # Secondary Actor: Payment Gateway
    rect_pg = patches.FancyBboxPatch((86, 6), 12, 6, boxstyle="round,pad=0.2", edgecolor=ACCENT_BLUE, facecolor="#EFF6FF", lw=1.5)
    ax.add_patch(rect_pg)
    ax.text(92, 9, "«Secondary Actor»\nPayment Gateway\n(UPI / Card / COD)", ha="center", va="center", fontsize=8, fontweight="bold", color=ACCENT_BLUE)

    # Customer Use Cases (Left Column)
    cust_uc = [
        (31, 83, "UC1: Register Account / Apply Admin"),
        (31, 76, "UC2: Login & Authentication"),
        (31, 69, "UC3: Browse Chocolate Catalog"),
        (31, 62, "UC4: Filter & Sort Chocolates"),
        (31, 55, "UC5: View Chocolate Details"),
        (31, 48, "UC6: Manage Shopping Cart"),
        (31, 41, "UC7: Manage Wishlist"),
        (31, 33, "UC8: Checkout & Place Order"),
        (31, 25, "UC9: Track Order & Live Timeline"),
        (31, 18, "UC10: Download Tax Invoice"),
        (31, 12, "UC11: Submit Product Review"),
        (31, 7, "UC12: Manage Customer Profile")
    ]

    for x, y, label in cust_uc:
        draw_use_case(x, y, label, width=19, height=3.6)
        # Connect to Customer actor (solid association)
        if label.startswith(("UC1:", "UC2:", "UC3:", "UC5:", "UC6:", "UC7:", "UC8:", "UC9:", "UC11:", "UC12:")):
            ax.plot([9.5, x - 9.5], [52, y], color="#888888", lw=1.1, zorder=1)

    # Extend: UC4 extends UC3
    ax.annotate("", xy=(31, 67.2), xytext=(31, 63.8),
                arrowprops=dict(arrowstyle="->", linestyle="dashed", color=ACCENT_GREEN, lw=1.5))
    ax.text(32, 65.5, "«extend»", ha="left", va="center", fontsize=7.5, color=ACCENT_GREEN, fontweight="bold")

    # Extend: UC10 extends UC9
    ax.annotate("", xy=(31, 23.2), xytext=(31, 19.8),
                arrowprops=dict(arrowstyle="->", linestyle="dashed", color=ACCENT_GREEN, lw=1.5))
    ax.text(32, 21.5, "«extend»", ha="left", va="center", fontsize=7.5, color=ACCENT_GREEN, fontweight="bold")

    # Included Use Cases inside checkout
    draw_use_case(52, 36, "UC13: Confirm Delivery Address", width=17, height=3.2, fill="#FEF3C7", edge="#D97706")
    draw_use_case(52, 29, "UC14: Process Payment Transaction", width=17, height=3.2, fill="#FEF3C7", edge="#D97706")
    
    # UC8 includes UC13 and UC14
    ax.annotate("", xy=(43.5, 35), xytext=(40.5, 34),
                arrowprops=dict(arrowstyle="->", linestyle="dashed", color=ACCENT_RED, lw=1.4))
    ax.text(42.5, 36.5, "«include»", ha="center", va="bottom", fontsize=7.5, color=ACCENT_RED, fontweight="bold")

    ax.annotate("", xy=(43.5, 30.5), xytext=(40.5, 32),
                arrowprops=dict(arrowstyle="->", linestyle="dashed", color=ACCENT_RED, lw=1.4))
    ax.text(42.5, 29.5, "«include»", ha="center", va="top", fontsize=7.5, color=ACCENT_RED, fontweight="bold")

    # Payment Gateway connection to UC14
    ax.plot([60.5, 86], [29, 9], color=ACCENT_BLUE, lw=1.2, linestyle="--")

    # Admin Use Cases (Right Column)
    admin_uc = [
        (69, 83, "UC15: Admin Secure Login"),
        (69, 76, "UC16: View Executive KPI Analytics"),
        (69, 69, "UC17: Manage Product Catalog & Stock"),
        (69, 62, "UC18: Manage Categories & Collections"),
        (69, 54, "UC19: Process & Fulfill Orders"),
        (69, 46, "UC20: Moderate Customer Reviews"),
        (69, 38, "UC21: Inspect Customer Directory"),
        (69, 27, "UC22: Review & Approve Admin Requests\n(Super Admin Exclusive)"),
        (69, 14, "UC23: Platform Logout & Session End")
    ]

    for x, y, label in admin_uc:
        is_super = "Super Admin" in label
        fill = "#FEE2E2" if is_super else "#F0FDF4"
        edge = ACCENT_RED if is_super else ACCENT_GREEN
        draw_use_case(x, y, label, width=20, height=4.0 if is_super else 3.6, fill=fill, edge=edge)
        
        if is_super:
            # Connect only to Super Admin
            ax.plot([90.5, x + 10], [28, y], color=ACCENT_RED, lw=1.4, zorder=1)
        else:
            # Connect to General Administrator
            ax.plot([90.5, x + 10], [65, y], color="#888888", lw=1.1, zorder=1)

    # Customer and Admin also connect to Logout
    ax.plot([9.5, 59], [52, 14], color="#AAAAAA", lw=1.0, linestyle=":")
    ax.plot([90.5, 79], [65, 14], color="#AAAAAA", lw=1.0, linestyle=":")

    # Legend Box
    leg_box = patches.FancyBboxPatch((2, 2), 14, 11, boxstyle="round,pad=0.2", edgecolor="#CCC", facecolor="#FAFAFA", lw=1)
    ax.add_patch(leg_box)
    ax.text(9, 11.5, "UML Notation Legend", ha="center", va="center", fontsize=8.5, fontweight="bold", color=PRIMARY_COCOA)
    ax.plot([3.5, 6.5], [9.5, 9.5], color="#888888", lw=1.2)
    ax.text(7.5, 9.5, "Association", va="center", fontsize=7.5)
    ax.plot([3.5, 6.5], [7.5, 7.5], color=ACCENT_RED, lw=1.2, linestyle="--")
    ax.text(7.5, 7.5, "«include»", va="center", fontsize=7.5, color=ACCENT_RED)
    ax.plot([3.5, 6.5], [5.5, 5.5], color=ACCENT_GREEN, lw=1.2, linestyle="--")
    ax.text(7.5, 5.5, "«extend»", va="center", fontsize=7.5, color=ACCENT_GREEN)
    ax.annotate("", xy=(6.5, 3.5), xytext=(3.5, 3.5), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.2))
    ax.text(7.5, 3.5, "Generalization", va="center", fontsize=7.5)

    plt.tight_layout()
    save_path = os.path.join(OUT_DIR, "corrected_use_case_diagram.png")
    plt.savefig(save_path, dpi=300, bbox_inches="tight")
    plt.close()
    print("Saved:", save_path)


# =============================================================
# 2. ACTIVITY DIAGRAM - USER SIDE (CUSTOMER)
# =============================================================
def generate_user_activity_diagram():
    fig, ax = plt.subplots(figsize=(14, 18), dpi=300)
    ax.set_facecolor(BG_COLOR)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis("off")

    # Title
    ax.text(50, 98.5, "Cocoa Bliss — Corrected Customer Activity Diagram", 
            ha="center", va="center", fontsize=17, fontweight="bold", color=PRIMARY_COCOA)
    ax.text(50, 96.8, "(Replaces Erroneous Fork/Join Concurrency with Realistic Decision-Loop Architecture)", 
            ha="center", va="center", fontsize=9.5, fontstyle="italic", color=MUTED_TEXT)

    # Swimlanes
    ax.plot([50, 50], [2, 95], color="#D1D5DB", lw=1.5, linestyle="--")
    ax.text(25, 94.5, "CUSTOMER INTERFACE (BROWSER / REACT)", ha="center", va="center", fontsize=11, fontweight="bold", color=PRIMARY_COCOA)
    ax.text(75, 94.5, "BACKEND SYSTEM / DATABASE (DJANGO + MYSQL)", ha="center", va="center", fontsize=11, fontweight="bold", color=PRIMARY_COCOA)

    def draw_action(x, y, text, w=22, h=3.2, fill="#FFF", edge=PRIMARY_COCOA):
        box = patches.FancyBboxPatch((x - w/2, y - h/2), w, h, boxstyle="round,pad=0.3,rounding_size=0.8",
                                     edgecolor=edge, facecolor=fill, lw=1.4, zorder=3)
        ax.add_patch(box)
        ax.text(x, y, text, ha="center", va="center", fontsize=8.0, fontweight="medium", color=TEXT_DARK, zorder=4)

    def draw_decision(x, y, label, size=3.0):
        diamond = patches.Polygon([[x, y + size], [x + size*1.5, y], [x, y - size], [x - size*1.5, y]],
                                  edgecolor="#D97706", facecolor="#FEF3C7", lw=1.5, zorder=3)
        ax.add_patch(diamond)
        ax.text(x, y, label, ha="center", va="center", fontsize=7.2, fontweight="bold", color="#92400E", zorder=4)

    # Initial Node
    init_circle = patches.Circle((25, 91.5), 1.2, facecolor=PRIMARY_COCOA, edgecolor=PRIMARY_COCOA, zorder=3)
    ax.add_patch(init_circle)
    ax.annotate("", xy=(25, 87.5), xytext=(25, 90.3), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.5))

    # Action 1: Visit Storefront
    draw_action(25, 86, "Open Website / Visit Storefront")
    ax.annotate("", xy=(25, 81.8), xytext=(25, 84.4), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.5))

    # Decision 1: Has Account / Intends to Authenticate?
    draw_decision(25, 79, "Has Account?")
    
    # Branch No -> Register
    ax.annotate("", xy=(12, 73.5), xytext=(20.5, 79), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    ax.text(14, 77.5, "[No / New User]", fontsize=7.5, color=MUTED_TEXT, fontweight="bold")
    draw_action(12, 72, "Fill Registration Form\n(Name, Email, Phone, Address)", w=18, h=3.0)

    # Register -> System creates user
    ax.annotate("", xy=(65, 72), xytext=(21, 72), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    draw_action(75, 72, "Validate Data & Hash Password\nCreate User Record (Role=Customer)", w=20, h=3.0, fill="#F0FDF4", edge=ACCENT_GREEN)

    # Branch Yes -> Login
    ax.annotate("", xy=(38, 73.5), xytext=(29.5, 79), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    ax.text(35, 77.5, "[Yes / Login]", fontsize=7.5, color=MUTED_TEXT, fontweight="bold")
    draw_action(38, 72, "Enter Email & Password", w=16, h=3.0)

    # Login -> System authenticates
    ax.annotate("", xy=(65, 66.5), xytext=(38, 70.5), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    draw_action(75, 65, "Authenticate Credentials\nIssue Auth Token / Session", w=20, h=3.0, fill="#F0FDF4", edge=ACCENT_GREEN)

    # Merge point: Main Customer Dashboard / Navigation Hub
    draw_action(25, 59, "Customer Navigation Hub / Storefront Menu\n(Catalog | Cart | Wishlist | Orders | Profile)", w=28, h=3.5, fill="#FDF8F3", edge=CARAMEL_ACCENT)
    
    # Routes from Auth to Hub
    ax.annotate("", xy=(25, 60.8), xytext=(75, 70.5), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.2, connectionstyle="arc3,rad=-0.2"))
    ax.annotate("", xy=(25, 60.8), xytext=(75, 63.5), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.2, connectionstyle="arc3,rad=-0.1"))

    # Decision Node: Customer Activity Choice (CORRECT UML DECISION - NOT FORK BAR!)
    draw_decision(25, 52, "Customer\nAction?", size=2.8)
    ax.annotate("", xy=(25, 54.8), xytext=(25, 57.2), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.5))

    # Path 1 (Far Left): Browse & Filter
    ax.annotate("", xy=(8, 45), xytext=(20.8, 52), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    ax.text(10, 49.5, "[Browse / Search]", fontsize=7.2, fontweight="bold", color=PRIMARY_COCOA)
    draw_action(8, 43, "Browse Categories &\nApply Price/Stock Filters", w=15, h=3.0)
    ax.annotate("", xy=(8, 38.5), xytext=(8, 41.5), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    draw_action(8, 37, "View Chocolate Details &\nCustomer Reviews", w=15, h=3.0)
    # Add to Cart / Wishlist
    ax.annotate("", xy=(8, 32.5), xytext=(8, 35.5), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    draw_action(8, 31, "Click 'Add to Cart' or\n'Add to Wishlist'", w=15, h=3.0)
    # System syncs cart
    ax.annotate("", xy=(65, 31), xytext=(15.5, 31), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    draw_action(75, 31, "Verify Stock Quantity &\nSync Cart / Wishlist DB", w=20, h=3.0, fill="#F0FDF4", edge=ACCENT_GREEN)
    # Loop back to hub
    ax.annotate("", xy=(18, 57.5), xytext=(65, 31), arrowprops=dict(arrowstyle="-|>", color="#888", lw=1.1, linestyle="--", connectionstyle="arc3,rad=0.3"))

    # Path 2 (Center-Left): Cart & Checkout Pipeline
    ax.annotate("", xy=(25, 45), xytext=(25, 49.2), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    ax.text(26, 47.5, "[Checkout]", fontsize=7.2, fontweight="bold", color=PRIMARY_COCOA)
    draw_action(25, 43, "View Cart & Adjust Quantity\n(Free Delivery Check ≥ ₹999)", w=16, h=3.0)
    ax.annotate("", xy=(25, 38.5), xytext=(25, 41.5), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    draw_action(25, 37, "Proceed to Checkout &\nConfirm Delivery Address", w=16, h=3.0)
    ax.annotate("", xy=(25, 32.5), xytext=(25, 35.5), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    draw_action(25, 31, "Select Payment Method\n(COD / UPI / Card)", w=16, h=3.0)

    # Process Payment & Order in Backend
    ax.annotate("", xy=(65, 25), xytext=(33, 31), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    draw_action(75, 24, "Process Payment Transaction\nCreate Order (CB-2026-XXXXX)\nSnapshot OrderItems & Deduct Stock", w=22, h=3.8, fill="#F0FDF4", edge=ACCENT_GREEN)

    # Order Confirmation
    ax.annotate("", xy=(33, 20), xytext=(64, 23), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    draw_action(25, 20, "Display Order Confirmation &\nConfetti Celebration", w=16, h=3.0)

    # Path 3 (Center-Right): Order Tracking & Review
    ax.annotate("", xy=(39, 45), xytext=(29.2, 52), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    ax.text(37, 49.5, "[Track / History]", fontsize=7.2, fontweight="bold", color=PRIMARY_COCOA)
    draw_action(40, 43, "View Order History &\n5-Stage Live Timeline", w=15, h=3.0)
    ax.annotate("", xy=(40, 38.5), xytext=(40, 41.5), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    draw_action(40, 37, "Download Itemized Tax Invoice\n(Printable GST Format)", w=15, h=3.0)
    ax.annotate("", xy=(40, 32.5), xytext=(40, 35.5), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    draw_action(40, 31, "Submit Star Rating &\nProduct Review Feedback", w=15, h=3.0)
    ax.annotate("", xy=(65, 15), xytext=(40, 29.5), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    draw_action(75, 15, "Save Review & Recalculate\nProduct Average Rating", w=20, h=3.0, fill="#F0FDF4", edge=ACCENT_GREEN)

    # Path 4 (Far Right): Logout / Session Termination
    ax.annotate("", xy=(32, 52), xytext=(29.2, 52), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    ax.text(33, 53.5, "[Logout / End]", fontsize=7.2, fontweight="bold", color=ACCENT_RED)
    draw_action(42, 52, "Click Logout", w=10, h=2.5)
    ax.annotate("", xy=(65, 52), xytext=(47, 52), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    draw_action(75, 52, "Clear Auth Token &\nInvalidate Session", w=18, h=2.8, fill="#FEE2E2", edge=ACCENT_RED)

    # Final Activity Node
    ax.annotate("", xy=(75, 45.5), xytext=(75, 50.6), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.5))
    final_outer = patches.Circle((75, 44), 1.4, facecolor="#FFF", edgecolor=PRIMARY_COCOA, lw=1.5, zorder=3)
    final_inner = patches.Circle((75, 44), 0.9, facecolor=PRIMARY_COCOA, edgecolor=PRIMARY_COCOA, zorder=4)
    ax.add_patch(final_outer)
    ax.add_patch(final_inner)
    ax.text(75, 41.5, "Session Ended (Final State)", ha="center", va="center", fontsize=8, fontweight="bold", color=PRIMARY_COCOA)

    # Explanation Callout
    callout = patches.FancyBboxPatch((2, 3), 46, 9, boxstyle="round,pad=0.3", edgecolor="#3B82F6", facecolor="#EFF6FF", lw=1.2)
    ax.add_patch(callout)
    ax.text(25, 9.5, "CORRECT UML PATTERN EXPLANATION", ha="center", va="center", fontsize=8.5, fontweight="bold", color="#1E40AF")
    ax.text(25, 6.2, "• Replaced the invalid Fork/Join bar with a Decision Node (Customer Action Choice).\n• Customers choose their desired action and loop back to navigation after completing tasks.\n• E-commerce checkout requires cart items; reviews are submitted after fulfillment.",
            ha="center", va="center", fontsize=7.5, color="#1E3A8A")

    plt.tight_layout()
    save_path = os.path.join(OUT_DIR, "corrected_user_activity_diagram.png")
    plt.savefig(save_path, dpi=300, bbox_inches="tight")
    plt.close()
    print("Saved:", save_path)


# =============================================================
# 3. ACTIVITY DIAGRAM - ADMIN SIDE
# =============================================================
def generate_admin_activity_diagram():
    fig, ax = plt.subplots(figsize=(14, 18), dpi=300)
    ax.set_facecolor(BG_COLOR)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis("off")

    # Title
    ax.text(50, 98.5, "Cocoa Bliss — Corrected Administrator Activity Diagram", 
            ha="center", va="center", fontsize=17, fontweight="bold", color=PRIMARY_COCOA)
    ax.text(50, 96.8, "(Replaces Fork/Join Concurrency with Realistic Admin Decision-Loop & Super Admin Approval Pipeline)", 
            ha="center", va="center", fontsize=9.5, fontstyle="italic", color=MUTED_TEXT)

    # Swimlanes
    ax.plot([50, 50], [2, 95], color="#D1D5DB", lw=1.5, linestyle="--")
    ax.text(25, 94.5, "ADMINISTRATOR UI (/admin)", ha="center", va="center", fontsize=11, fontweight="bold", color=PRIMARY_COCOA)
    ax.text(75, 94.5, "BACKEND SERVICES & RELATIONAL DATABASE", ha="center", va="center", fontsize=11, fontweight="bold", color=PRIMARY_COCOA)

    def draw_action(x, y, text, w=22, h=3.2, fill="#FFF", edge=PRIMARY_COCOA):
        box = patches.FancyBboxPatch((x - w/2, y - h/2), w, h, boxstyle="round,pad=0.3,rounding_size=0.8",
                                     edgecolor=edge, facecolor=fill, lw=1.4, zorder=3)
        ax.add_patch(box)
        ax.text(x, y, text, ha="center", va="center", fontsize=8.0, fontweight="medium", color=TEXT_DARK, zorder=4)

    def draw_decision(x, y, label, size=3.0):
        diamond = patches.Polygon([[x, y + size], [x + size*1.5, y], [x, y - size], [x - size*1.5, y]],
                                  edgecolor="#D97706", facecolor="#FEF3C7", lw=1.5, zorder=3)
        ax.add_patch(diamond)
        ax.text(x, y, label, ha="center", va="center", fontsize=7.2, fontweight="bold", color="#92400E", zorder=4)

    # Initial Node
    init_circle = patches.Circle((25, 91.5), 1.2, facecolor=PRIMARY_COCOA, edgecolor=PRIMARY_COCOA, zorder=3)
    ax.add_patch(init_circle)
    ax.annotate("", xy=(25, 87.5), xytext=(25, 90.3), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.5))

    # Action 1: Access Admin Portal
    draw_action(25, 86, "Navigate to Admin Portal (/admin)\nEnter Email & Password")
    ax.annotate("", xy=(65, 86), xytext=(36, 86), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.4))

    # Backend: Authenticate & Check Role
    draw_action(75, 86, "Authenticate User & Verify\nrole == 'admin'", w=20, h=3.2, fill="#F0FDF4", edge=ACCENT_GREEN)
    ax.annotate("", xy=(75, 80.5), xytext=(75, 84.4), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.4))

    # Decision: Approved Admin?
    draw_decision(75, 78, "admin_status\n== 'approved'?", size=2.8)

    # Not Approved -> Access Pending
    ax.annotate("", xy=(40, 78), xytext=(70.8, 78), arrowprops=dict(arrowstyle="-|>", color=ACCENT_RED, lw=1.3))
    ax.text(56, 79.2, "[No / Pending]", fontsize=7.5, color=ACCENT_RED, fontweight="bold")
    draw_action(28, 78, "Display 'Access Pending Approval'\nScreen (403 Forbidden)", w=22, h=3.0, fill="#FEE2E2", edge=ACCENT_RED)
    
    # Approved -> Load Dashboard
    ax.annotate("", xy=(75, 71.5), xytext=(75, 75.2), arrowprops=dict(arrowstyle="-|>", color=ACCENT_GREEN, lw=1.4))
    ax.text(76, 73.5, "[Yes / Approved]", fontsize=7.5, color=ACCENT_GREEN, fontweight="bold")
    draw_action(75, 70, "Compute Real-Time KPI Metrics\n(Revenue, Orders, Low Stock, Users)", w=22, h=3.2, fill="#F0FDF4", edge=ACCENT_GREEN)

    # Display Dashboard
    ax.annotate("", xy=(36, 70), xytext=(64, 70), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.4))
    draw_action(25, 70, "Display Executive KPI Dashboard\n(Sales Overview, Donut Chart, Alerts)", w=22, h=3.2, fill="#FDF8F3", edge=CARAMEL_ACCENT)

    # Admin Operations Loop (Decision Node)
    ax.annotate("", xy=(25, 62.5), xytext=(25, 68.4), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.5))
    draw_decision(25, 60, "Select Admin\nModule", size=2.8)

    # Branch 1: Products & Stock Management
    ax.annotate("", xy=(8, 51.5), xytext=(20.8, 60), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    ax.text(9, 56.5, "[Products & Stock]", fontsize=7.2, fontweight="bold", color=PRIMARY_COCOA)
    draw_action(8, 50, "Manage Products Table\n(Filter, Search, Low-Stock)", w=15, h=3.0)
    ax.annotate("", xy=(8, 44.5), xytext=(8, 48.5), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    draw_action(8, 43, "Add / Edit Chocolate Details\nUpdate Stock, Price & Bestseller", w=15, h=3.0)
    ax.annotate("", xy=(65, 43), xytext=(15.5, 43), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    draw_action(75, 43, "Validate & Persist Product Changes\nAuto-update is_available if Stock=0", w=22, h=3.0, fill="#F0FDF4", edge=ACCENT_GREEN)

    # Branch 2: Categories Management
    ax.annotate("", xy=(20, 51.5), xytext=(23.5, 57.2), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    ax.text(17, 54.5, "[Categories]", fontsize=7.2, fontweight="bold", color=PRIMARY_COCOA)
    draw_action(20, 50, "Manage Categories\n(Add / Edit / Slugs)", w=14, h=3.0)
    ax.annotate("", xy=(65, 50), xytext=(27, 50), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    draw_action(75, 50, "Persist Category with Relational\nIntegrity Protection", w=22, h=3.0, fill="#F0FDF4", edge=ACCENT_GREEN)

    # Branch 3: Order Fulfillment Pipeline
    ax.annotate("", xy=(33, 51.5), xytext=(26.5, 57.2), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    ax.text(31, 54.5, "[Order Fulfillment]", fontsize=7.2, fontweight="bold", color=PRIMARY_COCOA)
    draw_action(33, 50, "View Orders List &\nFilter by Fulfillment Status", w=15, h=3.0)
    ax.annotate("", xy=(33, 44.5), xytext=(33, 48.5), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    draw_action(33, 43, "Update Status: Pending → Confirmed\n→ Preparing → Shipped → Delivered", w=15, h=3.0)
    ax.annotate("", xy=(65, 36), xytext=(40.5, 43), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    draw_action(75, 35, "Save Order Status & Dispatch\nReal-Time Customer Notification", w=22, h=3.0, fill="#F0FDF4", edge=ACCENT_GREEN)

    # Branch 4: Super Admin Approvals
    ax.annotate("", xy=(44, 51.5), xytext=(29.2, 60), arrowprops=dict(arrowstyle="-|>", color=ACCENT_RED, lw=1.3))
    ax.text(38, 58.5, "[Super Admin: Approvals]", fontsize=7.2, fontweight="bold", color=ACCENT_RED)
    draw_action(44, 50, "View Admin Applicant Directory\n(rohit.admin@example.com)", w=15, h=3.0, fill="#FEF2F2", edge=ACCENT_RED)
    ax.annotate("", xy=(44, 44.5), xytext=(44, 48.5), arrowprops=dict(arrowstyle="-|>", color=ACCENT_RED, lw=1.3))
    draw_action(44, 43, "Click 'Approve' or 'Reject'\n(1-Click Super Admin Action)", w=15, h=3.0, fill="#FEF2F2", edge=ACCENT_RED)
    ax.annotate("", xy=(65, 27), xytext=(44, 41.5), arrowprops=dict(arrowstyle="-|>", color=ACCENT_RED, lw=1.3))
    draw_action(75, 27, "Promote User to is_staff=True &\nSet admin_status='approved'", w=22, h=3.0, fill="#FEF2F2", edge=ACCENT_RED)

    # Branch 5: Review Moderation
    ax.annotate("", xy=(15, 36.5), xytext=(20.8, 60), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3, connectionstyle="arc3,rad=-0.1"))
    ax.text(12, 39.5, "[Reviews]", fontsize=7.2, fontweight="bold", color=PRIMARY_COCOA)
    draw_action(15, 35, "Inspect Customer Reviews\nApprove or Delete Inappropriate", w=16, h=3.0)
    ax.annotate("", xy=(65, 19), xytext=(23, 35), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3))
    draw_action(75, 19, "Delete Review & Trigger\nproduct.update_rating()", w=22, h=3.0, fill="#F0FDF4", edge=ACCENT_GREEN)

    # Logout / End Session
    ax.annotate("", xy=(25, 25.5), xytext=(25, 57.2), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.3, linestyle=":"))
    ax.text(26, 27.5, "[Logout]", fontsize=7.5, fontweight="bold", color=ACCENT_RED)
    draw_action(25, 24, "Admin Logout & Session Clear", w=16, h=2.6, fill="#FEE2E2", edge=ACCENT_RED)

    # Final Node
    ax.annotate("", xy=(25, 18.5), xytext=(25, 22.7), arrowprops=dict(arrowstyle="-|>", color=PRIMARY_COCOA, lw=1.5))
    final_outer = patches.Circle((25, 17), 1.4, facecolor="#FFF", edgecolor=PRIMARY_COCOA, lw=1.5, zorder=3)
    final_inner = patches.Circle((25, 17), 0.9, facecolor=PRIMARY_COCOA, edgecolor=PRIMARY_COCOA, zorder=4)
    ax.add_patch(final_outer)
    ax.add_patch(final_inner)
    ax.text(25, 14.5, "Admin Session Terminated (Final State)", ha="center", va="center", fontsize=8, fontweight="bold", color=PRIMARY_COCOA)

    # Loopback lines (After action, return to dashboard)
    ax.plot([86, 92, 92, 25], [43, 43, 67, 67], color="#9CA3AF", lw=1.1, linestyle="--")

    # Explanation Callout
    callout = patches.FancyBboxPatch((2, 3), 46, 9, boxstyle="round,pad=0.3", edgecolor="#3B82F6", facecolor="#EFF6FF", lw=1.2)
    ax.add_patch(callout)
    ax.text(25, 9.5, "CORRECT ADMIN ARCHITECTURE EXPLANATION", ha="center", va="center", fontsize=8.5, fontweight="bold", color="#1E40AF")
    ax.text(25, 6.2, "• Eliminated the invalid concurrency Fork/Join bar across admin functions.\n• Added the actual Super Admin Approval Workflow unique to Cocoa Bliss.\n• Admins execute discrete management tasks and return to the live dashboard.",
            ha="center", va="center", fontsize=7.5, color="#1E3A8A")

    plt.tight_layout()
    save_path = os.path.join(OUT_DIR, "corrected_admin_activity_diagram.png")
    plt.savefig(save_path, dpi=300, bbox_inches="tight")
    plt.close()
    print("Saved:", save_path)


# =============================================================
# 4. CLASS DIAGRAM (UML 2.5 OBJECT-ORIENTED DOMAIN MODEL)
# =============================================================
def generate_class_diagram():
    fig, ax = plt.subplots(figsize=(18, 14), dpi=300)
    ax.set_facecolor(BG_COLOR)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis("off")

    # Title
    ax.text(50, 98.2, "Cocoa Bliss — Corrected UML Class Diagram", 
            ha="center", va="center", fontsize=18, fontweight="bold", color=PRIMARY_COCOA)
    ax.text(50, 96.2, "(UML 2.5 Object-Oriented Domain Model: Purged Relational FKs, Correct Compositions & Domain Methods)", 
            ha="center", va="center", fontsize=10, fontstyle="italic", color=MUTED_TEXT)

    def draw_class(x, y, name, attrs, methods, w=15, h=14, header_color="#2A150D", header_text="#FFF"):
        # Box background
        box = patches.FancyBboxPatch((x - w/2, y - h/2), w, h, boxstyle="square,pad=0",
                                     edgecolor=BORDER_COLOR, facecolor="#FCFAF7", lw=1.5, zorder=2)
        ax.add_patch(box)
        
        # Header banner
        header_h = 2.2
        header = patches.Rectangle((x - w/2, y + h/2 - header_h), w, header_h,
                                   facecolor=header_color, edgecolor=BORDER_COLOR, lw=1.5, zorder=3)
        ax.add_patch(header)
        ax.text(x, y + h/2 - header_h/2, name, ha="center", va="center",
                fontsize=9.5, fontweight="bold", color=header_text, zorder=4)

        # Attributes section
        attr_text = "\n".join(attrs)
        attr_y = y + h/2 - header_h - 0.4
        ax.text(x - w/2 + 0.5, attr_y, attr_text, ha="left", va="top",
                fontsize=7.2, color=TEXT_DARK, zorder=4, family="monospace")

        # Divider line
        div_y = y - 0.5
        ax.plot([x - w/2, x + w/2], [div_y, div_y], color=BORDER_COLOR, lw=1.0, zorder=3)

        # Methods section
        meth_text = "\n".join(methods)
        ax.text(x - w/2 + 0.5, div_y - 0.4, meth_text, ha="left", va="top",
                fontsize=7.2, color=TEXT_DARK, zorder=4, family="monospace")

    # 1. User Class
    draw_class(10, 80, "User", 
               ["+ id: Integer", "+ email: String", "+ fullName: String", "+ phone: String",
                "+ address: String", "+ city: String", "+ postalCode: String", "+ role: String",
                "+ adminStatus: String", "+ isStaff: Boolean", "+ dateJoined: DateTime"],
               ["+ register(): Boolean", "+ authenticate(): Token", "+ approveAdmin(): Void",
                "+ updateProfile(): Void", "+ canAccessAdmin(): Boolean"],
               w=16, h=19)

    # 2. Category Class
    draw_class(90, 80, "Category",
               ["+ id: Integer", "+ name: String", "+ slug: String", "+ description: String",
                "+ imageUrl: String", "+ isActive: Boolean", "+ createdAt: DateTime"],
               ["+ getActiveProducts(): List", "+ generateSlug(): String"],
               w=15, h=15)

    # 3. Product Class
    draw_class(65, 80, "Product",
               ["+ id: Integer", "+ name: String", "+ slug: String", "+ shortDescription: String",
                "+ description: String", "+ ingredients: String", "+ price: Decimal",
                "+ weight: String", "+ stockQuantity: Integer", "+ isAvailable: Boolean",
                "+ isBestseller: Boolean", "+ rating: Decimal", "+ reviewCount: Integer"],
               ["+ isLowStock(): Boolean", "+ checkAvailability(qty): Boolean",
                "+ deductStock(qty): Void", "+ updateRating(): Void"],
               w=18, h=21)

    # 4. Cart Class
    draw_class(10, 48, "Cart",
               ["+ id: Integer", "+ createdAt: DateTime", "+ updatedAt: DateTime"],
               ["+ calculateSubtotal(): Decimal", "+ getDeliveryCharge(): Decimal",
                "+ getFinalTotal(): Decimal", "+ clearCart(): Void"],
               w=16, h=14)

    # 5. CartItem Class
    draw_class(37, 48, "CartItem",
               ["+ id: Integer", "+ quantity: Integer"],
               ["+ getSubtotal(): Decimal", "+ updateQuantity(qty): Void"],
               w=14, h=11)

    # 6. Wishlist Class
    draw_class(10, 23, "Wishlist",
               ["+ id: Integer", "+ createdAt: DateTime"],
               ["+ getTotalItems(): Integer", "+ clearWishlist(): Void"],
               w=16, h=11)

    # 7. WishlistItem Class
    draw_class(37, 23, "WishlistItem",
               ["+ id: Integer", "+ createdAt: DateTime"],
               ["+ moveToCart(): Void"],
               w=14, h=9)

    # 8. Order Class
    draw_class(65, 43, "Order",
               ["+ id: Integer", "+ orderNumber: String", "+ customerName: String",
                "+ customerEmail: String", "+ customerPhone: String", "+ shippingAddress: String",
                "+ subtotal: Decimal", "+ deliveryCharge: Decimal", "+ totalAmount: Decimal",
                "+ paymentMethod: String", "+ paymentStatus: String", "+ orderStatus: String",
                "+ createdAt: DateTime"],
               ["+ placeOrder(): Boolean", "+ cancelOrder(): Void",
                "+ updateStatus(newStatus): Void", "+ isFreeDelivery(): Boolean"],
               w=18, h=22)

    # 9. OrderItem Class
    draw_class(90, 43, "OrderItem",
               ["+ id: Integer", "+ productNameSnapshot: String", "+ productImageSnapshot: String",
                "+ productWeightSnapshot: String", "+ unitPrice: Decimal", "+ quantity: Integer",
                "+ subtotal: Decimal"],
               ["+ calculateItemTotal(): Decimal"],
               w=15, h=15)

    # 10. Payment Class
    draw_class(65, 12, "Payment",
               ["+ id: Integer", "+ amount: Decimal", "+ paymentMethod: String",
                "+ paymentStatus: String", "+ transactionReference: String", "+ paymentDate: DateTime"],
               ["+ verifyTransaction(): Boolean", "+ markCompleted(): Void"],
               w=17, h=14)

    # 11. Review Class
    draw_class(90, 14, "Review",
               ["+ id: Integer", "+ rating: Integer", "+ comment: String", "+ createdAt: DateTime"],
               ["+ validateRating(): Boolean"],
               w=15, h=11)

    # 12. Notification Class
    draw_class(37, 80, "Notification",
               ["+ id: Integer", "+ title: String", "+ message: String", "+ link: String",
                "+ isRead: Boolean", "+ createdAt: DateTime"],
               ["+ markAsRead(): Void"],
               w=14, h=12)

    # Helper function to draw composition diamond (filled black)
    def draw_composition(x1, y1, x2, y2, mult1="1", mult2="1..*"):
        # Line
        ax.plot([x1, x2], [y1, y2], color=PRIMARY_COCOA, lw=1.6, zorder=2)
        # Diamond at (x1, y1)
        d_size = 0.8
        dx = (x2 - x1) / np.hypot(x2 - x1, y2 - y1)
        dy = (y2 - y1) / np.hypot(x2 - x1, y2 - y1)
        # Diamond points
        p1 = [x1, y1]
        p2 = [x1 + dx*d_size - dy*d_size*0.7, y1 + dy*d_size + dx*d_size*0.7]
        p3 = [x1 + dx*d_size*2, y1 + dy*d_size*2]
        p4 = [x1 + dx*d_size + dy*d_size*0.7, y1 + dy*d_size - dx*d_size*0.7]
        diamond = patches.Polygon([p1, p2, p3, p4], facecolor=PRIMARY_COCOA, edgecolor=PRIMARY_COCOA, zorder=5)
        ax.add_patch(diamond)
        # Multiplicities
        ax.text(x1 + dx*2.6, y1 + dy*2.6, mult1, fontsize=8, fontweight="bold", color=PRIMARY_COCOA)
        ax.text(x2 - dx*2.0, y2 - dy*2.0, mult2, fontsize=8, fontweight="bold", color=PRIMARY_COCOA)

    # Helper for simple association
    def draw_association(x1, y1, x2, y2, mult1="1", mult2="*", label=""):
        ax.plot([x1, x2], [y1, y2], color=PRIMARY_COCOA, lw=1.4, zorder=2)
        dx = (x2 - x1) / max(np.hypot(x2 - x1, y2 - y1), 0.01)
        dy = (y2 - y1) / max(np.hypot(x2 - x1, y2 - y1), 0.01)
        ax.text(x1 + dx*2.0, y1 + dy*2.0, mult1, fontsize=8, fontweight="bold", color=PRIMARY_COCOA)
        ax.text(x2 - dx*2.0, y2 - dy*2.0, mult2, fontsize=8, fontweight="bold", color=PRIMARY_COCOA)
        if label:
            mx, my = (x1 + x2)/2, (y1 + y2)/2
            ax.text(mx, my + 0.8, label, fontsize=7.5, fontstyle="italic", ha="center", color=MUTED_TEXT)

    # Relationships:
    # User 1 --- 1 Cart
    draw_association(10, 70.5, 10, 55, mult1="1", mult2="1", label="owns")
    # User 1 --- 1 Wishlist
    draw_association(10, 41, 10, 28.5, mult1="1", mult2="1", label="has")
    # User 1 --- 0..* Notification
    draw_association(18, 80, 30, 80, mult1="1", mult2="0..*", label="receives")
    # User 1 --- 0..* Order
    draw_association(18, 73, 56, 48, mult1="1", mult2="0..*", label="places")
    # User 1 --- 0..* Review
    ax.plot([18, 22, 22, 82.5], [71, 71, 14, 14], color="#888", lw=1.1, linestyle=":")
    ax.text(23, 14.8, "User 1..* submits Review", fontsize=7, color=MUTED_TEXT)

    # Cart ◆--- 0..* CartItem (Composition)
    draw_composition(18, 48, 30, 48, mult1="1", mult2="0..*")
    # Wishlist ◆--- 0..* WishlistItem (Composition)
    draw_composition(18, 23, 30, 23, mult1="1", mult2="0..*")

    # CartItem refers to Product
    ax.annotate("", xy=(56, 73), xytext=(44, 48),
                arrowprops=dict(arrowstyle="->", color=PRIMARY_COCOA, lw=1.3))
    ax.text(50, 60, "refers to\n0..* → 1", fontsize=7.5, color=PRIMARY_COCOA, fontweight="bold")

    # Category 1 --- 0..* Product
    draw_association(82.5, 80, 74, 80, mult1="1", mult2="0..*", label="belongs to")

    # Order ◆--- 1..* OrderItem (Composition)
    draw_composition(74, 43, 82.5, 43, mult1="1", mult2="1..*")

    # OrderItem refers to Product (Snapshot)
    ax.annotate("", xy=(74, 73), xytext=(90, 50.5),
                arrowprops=dict(arrowstyle="->", color=PRIMARY_COCOA, lw=1.3))
    ax.text(85, 62, "snapshots\n0..* → 0..1", fontsize=7.5, color=PRIMARY_COCOA, fontweight="bold")

    # Order 1 --- 1 Payment
    draw_association(65, 32, 65, 19, mult1="1", mult2="1", label="paid by")

    # Product 1 --- 0..* Review
    draw_association(74, 70, 90, 20, mult1="1", mult2="0..*", label="receives")

    plt.tight_layout()
    save_path = os.path.join(OUT_DIR, "corrected_class_diagram.png")
    plt.savefig(save_path, dpi=300, bbox_inches="tight")
    plt.close()
    print("Saved:", save_path)


# =============================================================
# 5. DATABASE RELATIONAL SCHEMA & ERD
# =============================================================
def generate_database_erd():
    fig, ax = plt.subplots(figsize=(18, 14), dpi=300)
    ax.set_facecolor(BG_COLOR)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis("off")

    # Title
    ax.text(50, 98.2, "Cocoa Bliss — Complete Relational Database ERD", 
            ha="center", va="center", fontsize=18, fontweight="bold", color=PRIMARY_COCOA)
    ax.text(50, 96.2, "(Comprehensive 12-Table Production Schema with Foreign Key Constraints & Historical Immutability)", 
            ha="center", va="center", fontsize=10, fontstyle="italic", color=MUTED_TEXT)

    def draw_table(x, y, name, columns, w=15, h=15, header_color="#1E293B"):
        box = patches.FancyBboxPatch((x - w/2, y - h/2), w, h, boxstyle="square,pad=0",
                                     edgecolor="#334155", facecolor="#F8FAFC", lw=1.4, zorder=2)
        ax.add_patch(box)
        
        # Header banner
        header_h = 2.0
        header = patches.Rectangle((x - w/2, y + h/2 - header_h), w, header_h,
                                   facecolor=header_color, edgecolor="#334155", lw=1.4, zorder=3)
        ax.add_patch(header)
        ax.text(x, y + h/2 - header_h/2, name, ha="center", va="center",
                fontsize=9.0, fontweight="bold", color="#FFF", zorder=4)

        # Columns
        col_y = y + h/2 - header_h - 0.4
        for col in columns:
            is_pk = "PK" in col
            is_fk = "FK" in col
            col_color = "#B91C1C" if is_pk else ("#1D4ED8" if is_fk else "#0F172A")
            font_w = "bold" if (is_pk or is_fk) else "normal"
            ax.text(x - w/2 + 0.4, col_y, col, ha="left", va="top",
                    fontsize=6.8, color=col_color, zorder=4, family="monospace", fontweight=font_w)
            col_y -= 0.95

    # Tables
    draw_table(10, 80, "users",
               ["PK user_id: INT AUTO_INC", "   name: VARCHAR(150)", "UQ email: VARCHAR(100)",
                "   phone: VARCHAR(20)", "   password: VARCHAR(255)", "   address: TEXT",
                "   city: VARCHAR(100)", "   state: VARCHAR(100)", "   postal_code: VARCHAR(20)",
                "   role: VARCHAR(20)", "   admin_status: VARCHAR(20)", "   is_staff: BOOLEAN",
                "   created_at: DATETIME"],
               w=16, h=17, header_color="#0F172A")

    draw_table(90, 80, "categories",
               ["PK category_id: INT AUTO_INC", "UQ name: VARCHAR(100)", "UQ slug: VARCHAR(120)",
                "   description: TEXT", "   image_url: VARCHAR(500)", "   is_active: BOOLEAN",
                "   created_at: DATETIME"],
               w=15, h=12, header_color="#0F172A")

    draw_table(65, 78, "products",
               ["PK product_id: INT AUTO_INC", "FK category_id: INT", "   name: VARCHAR(200)",
                "UQ slug: VARCHAR(220)", "   short_description: VARCHAR(255)", "   description: TEXT",
                "   ingredients: TEXT", "   price: DECIMAL(10,2)", "   weight: VARCHAR(50)",
                "   image_url: VARCHAR(500)", "   stock_quantity: INT", "   is_available: BOOLEAN",
                "   is_bestseller: BOOLEAN", "   rating: DECIMAL(3,1)", "   review_count: INT"],
               w=17, h=19, header_color="#0F172A")

    draw_table(10, 48, "carts",
               ["PK cart_id: INT AUTO_INC", "FK user_id: INT (UNIQUE)", "   created_at: DATETIME", "   updated_at: DATETIME"],
               w=15, h=8, header_color="#1E293B")

    draw_table(36, 48, "cart_items",
               ["PK cart_item_id: INT AUTO_INC", "FK cart_id: INT", "FK product_id: INT",
                "   quantity: INT", "UQ (cart_id, product_id)"],
               w=16, h=9, header_color="#1E293B")

    draw_table(10, 24, "wishlists",
               ["PK wishlist_id: INT AUTO_INC", "FK user_id: INT (UNIQUE)", "   created_at: DATETIME"],
               w=15, h=7, header_color="#1E293B")

    draw_table(36, 24, "wishlist_items",
               ["PK wishlist_item_id: INT", "FK wishlist_id: INT", "FK product_id: INT",
                "   created_at: DATETIME", "UQ (wishlist_id, product_id)"],
               w=16, h=8, header_color="#1E293B")

    draw_table(65, 41, "orders",
               ["PK order_id: INT AUTO_INC", "UQ order_number: VARCHAR(50)", "FK user_id: INT",
                "   customer_name: VARCHAR(150)", "   customer_email: VARCHAR(100)", "   customer_phone: VARCHAR(20)",
                "   shipping_address: TEXT", "   city: VARCHAR(100)", "   postal_code: VARCHAR(20)",
                "   subtotal: DECIMAL(10,2)", "   delivery_charge: DECIMAL(10,2)", "   total_amount: DECIMAL(10,2)",
                "   payment_method: VARCHAR(20)", "   payment_status: VARCHAR(20)", "   order_status: VARCHAR(20)",
                "   created_at: DATETIME"],
               w=18, h=21, header_color="#0F172A")

    draw_table(91, 41, "order_items",
               ["PK order_item_id: INT AUTO_INC", "FK order_id: INT", "FK product_id: INT (SET NULL)",
                "   product_name_snapshot: VARCHAR(200)", "   product_image_snapshot: VARCHAR(500)",
                "   product_weight_snapshot: VARCHAR(50)", "   unit_price: DECIMAL(10,2)",
                "   quantity: INT", "   subtotal: DECIMAL(10,2)"],
               w=16, h=14, header_color="#0F172A")

    draw_table(65, 12, "payments",
               ["PK payment_id: INT AUTO_INC", "FK order_id: INT (UNIQUE)", "   amount: DECIMAL(10,2)",
                "   payment_method: VARCHAR(50)", "   payment_status: VARCHAR(30)", "   payment_date: DATETIME"],
               w=17, h=10, header_color="#1E293B")

    draw_table(91, 14, "reviews",
               ["PK review_id: INT AUTO_INC", "FK user_id: INT", "FK product_id: INT",
                "   rating: INT", "   comment: TEXT", "   created_at: DATETIME"],
               w=15, h=10, header_color="#1E293B")

    draw_table(36, 80, "notifications",
               ["PK notification_id: INT AUTO_INC", "FK user_id: INT", "   title: VARCHAR(200)",
                "   message: TEXT", "   link: VARCHAR(255)", "   is_read: BOOLEAN", "   created_at: DATETIME"],
               w=16, h=11, header_color="#1E293B")

    # Draw FK connections
    def draw_fk(x1, y1, x2, y2, color="#475569", label=""):
        ax.plot([x1, x2], [y1, y2], color=color, lw=1.3, zorder=2)
        ax.plot([x2], [y2], marker="o", markersize=4, color=color, zorder=3)
        if label:
            mx, my = (x1 + x2)/2, (y1 + y2)/2
            ax.text(mx, my + 0.6, label, fontsize=6.8, color=color, ha="center")

    # users 1:1 carts
    draw_fk(10, 71.5, 10, 52, label="1 : 1 (ON DELETE CASCADE)")
    # users 1:1 wishlists
    draw_fk(10, 44, 10, 27.5, label="1 : 1 (ON DELETE CASCADE)")
    # users 1:N notifications
    draw_fk(18, 80, 28, 80, label="1 : N")
    # users 1:N orders
    draw_fk(18, 73, 56, 45, label="1 : N")
    
    # carts 1:N cart_items
    draw_fk(17.5, 48, 28, 48, label="1 : N (CASCADE)")
    # products 1:N cart_items
    draw_fk(56.5, 70, 44, 52, label="1 : N")

    # wishlists 1:N wishlist_items
    draw_fk(17.5, 24, 28, 24, label="1 : N (CASCADE)")
    # products 1:N wishlist_items
    draw_fk(56.5, 69, 44, 28, label="1 : N")

    # categories 1:N products
    draw_fk(82.5, 80, 73.5, 80, label="1 : N (RESTRICT / CASCADE)")

    # orders 1:N order_items
    draw_fk(74, 41, 83, 41, label="1 : N (CASCADE)")
    # products 0..1:N order_items (SET NULL)
    draw_fk(73.5, 69, 87, 48, label="1 : N (SET NULL)")

    # orders 1:1 payments
    draw_fk(65, 30.5, 65, 17, label="1 : 1 (CASCADE)")

    # users & products to reviews
    draw_fk(73.5, 69, 88, 19, label="1 : N")

    plt.tight_layout()
    save_path = os.path.join(OUT_DIR, "corrected_database_erd.png")
    plt.savefig(save_path, dpi=300, bbox_inches="tight")
    plt.close()
    print("Saved:", save_path)


if __name__ == "__main__":
    print("Generating diagrams...")
    generate_use_case_diagram()
    generate_user_activity_diagram()
    generate_admin_activity_diagram()
    generate_class_diagram()
    generate_database_erd()
    print("All diagrams successfully generated!")

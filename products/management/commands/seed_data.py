from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from products.models import Category, Product, Review
from orders.models import Order, OrderItem
from notifications.models import Notification

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds initial Cocoa Bliss categories, handcrafted chocolate products, demo accounts, and reviews'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.NOTICE("[SEED] Starting Cocoa Bliss database seeding..."))

        # 1. Demo Administrator Account
        admin_email = 'admin@cocoabliss.com'
        admin_user, created = User.objects.get_or_create(
            email=admin_email,
            defaults={
                'username': admin_email,
                'full_name': 'Cocoa Bliss Admin',
                'phone': '+91 98765 43210',
                'address': '12 Artisan Way, Indiranagar',
                'city': 'Bengaluru',
                'state': 'Karnataka',
                'postal_code': '560038',
                'role': 'admin',
                'admin_status': 'approved',
                'is_staff': True,
                'is_superuser': True
            }
        )
        admin_user.role = 'admin'
        admin_user.admin_status = 'approved'
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.set_password('Admin@123')
        admin_user.save()
        self.stdout.write(self.style.SUCCESS(f" Configured Super Admin: {admin_email} (Password: Admin@123)"))

        # 2. Demo Customer Account
        customer_email = 'customer@cocoabliss.com'
        customer_user, created = User.objects.get_or_create(
            email=customer_email,
            defaults={
                'username': customer_email,
                'full_name': 'Priya Sharma',
                'phone': '+91 98123 45678',
                'address': 'Flat 402, Lotus Apartments, Koramangala',
                'city': 'Bengaluru',
                'state': 'Karnataka',
                'postal_code': '560034',
                'role': 'customer',
                'admin_status': 'none',
            }
        )
        customer_user.role = 'customer'
        customer_user.admin_status = 'none'
        customer_user.set_password('Customer@123')
        customer_user.save()

        # 3. Sample Pending Admin Applicant
        applicant_email = 'rohit.admin@example.com'
        applicant_user, created = User.objects.get_or_create(
            email=applicant_email,
            defaults={
                'username': applicant_email,
                'full_name': 'Rohit Varma',
                'phone': '+91 99887 76655',
                'address': '77 Brigade Road',
                'city': 'Bengaluru',
                'state': 'Karnataka',
                'postal_code': '560025',
                'role': 'customer',
                'admin_status': 'pending',
                'is_staff': False,
            }
        )
        applicant_user.role = 'customer'
        applicant_user.admin_status = 'pending'
        applicant_user.is_staff = False
        applicant_user.save()
        self.stdout.write(self.style.NOTICE(f" Seeded Pending Admin Applicant: {applicant_email} (Password: Applicant@123)"))

        # Additional review users
        reviewer1, _ = User.objects.get_or_create(
            email='ananya@example.com',
            defaults={'username': 'ananya@example.com', 'full_name': 'Ananya Roy', 'role': 'customer'}
        )
        reviewer2, _ = User.objects.get_or_create(
            email='rahul@example.com',
            defaults={'username': 'rahul@example.com', 'full_name': 'Rahul Verma', 'role': 'customer'}
        )

        # 3. Categories
        categories_data = [
            {
                'name': 'Milk Chocolate',
                'description': 'Smooth, creamy, and velvety handcrafted milk chocolates with rich European dairy.',
                'image_url': 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=600&q=80',
            },
            {
                'name': 'Dark Chocolate',
                'description': 'Intense, aromatic artisanal dark chocolate ranging from 60% to 85% single-origin cocoa.',
                'image_url': 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80',
            },
            {
                'name': 'White Chocolate',
                'description': 'Delicately sweet, rich cocoa butter infused with natural Madagascar Bourbon vanilla.',
                'image_url': 'https://images.unsplash.com/photo-1621236378699-8597fee6a1ce?auto=format&fit=crop&w=600&q=80',
            },
            {
                'name': 'Nut Chocolates',
                'description': 'Slow-roasted crunchy California almonds, hazelnuts, and pistachios smothered in fine chocolate.',
                'image_url': 'https://images.unsplash.com/photo-1575372587186-50020b3a7a97?auto=format&fit=crop&w=600&q=80',
            },
            {
                'name': 'Truffle Chocolates',
                'description': 'Melt-in-your-mouth velvety chocolate ganache rolled in pure Dutch cocoa and crunchy rocher.',
                'image_url': 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=600&q=80',
            },
            {
                'name': 'Gift Boxes',
                'description': 'Handcrafted celebratory boxes tied with satin ribbons, perfect for gifting your loved ones.',
                'image_url': 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80',
            },
        ]

        cat_objs = {}
        for cdata in categories_data:
            cat, _ = Category.objects.update_or_create(
                name=cdata['name'],
                defaults={
                    'description': cdata['description'],
                    'image_url': cdata['image_url'],
                    'is_active': True
                }
            )
            cat_objs[cdata['name']] = cat

        self.stdout.write(self.style.SUCCESS(f" Seeded {len(cat_objs)} categories."))

        # 4. Handcrafted Products
        products_data = [
            {
                'name': 'Assorted Chocolate Box',
                'category': cat_objs['Gift Boxes'],
                'short_description': 'Signature box of 12 handcrafted assorted artisan truffles & praline gems.',
                'description': 'Our most celebrated collection. Features an exquisite assortment of dark ganache, milk salted caramel, white vanilla bean, and toasted hazelnut rocher bonbons made in small batches.',
                'ingredients': 'Cocoa Butter, Cocoa Solids, Pure Dairy Cream, Cane Sugar, Roasted Hazelnuts, Madagascar Vanilla, Salt.',
                'price': 599.00,
                'original_price': 699.00,
                'weight': '250g (12 Pcs)',
                'image_url': 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80',
                'stock_quantity': 40,
                'is_bestseller': True,
                'is_featured': True,
                'rating': 4.9,
                'review_count': 128,
            },
            {
                'name': 'Dark Chocolate Bar',
                'category': cat_objs['Dark Chocolate'],
                'short_description': '75% single-origin dark chocolate with roasted cocoa nibs.',
                'description': 'Handcrafted using single-origin cocoa beans from Kerala and Ghana. Perfectly balanced with deep earthy notes, subtle berry undertones, and a velvety smooth finish.',
                'ingredients': 'Ecuadorian & Indian Cocoa Mass (75%), Unrefined Cane Sugar, Cocoa Butter, Crushed Roasted Cocoa Nibs.',
                'price': 249.00,
                'original_price': 299.00,
                'weight': '100g Bar',
                'image_url': 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=800&q=80',
                'stock_quantity': 65,
                'is_bestseller': True,
                'is_featured': True,
                'rating': 4.8,
                'review_count': 96,
            },
            {
                'name': 'Hazelnut Truffles',
                'category': cat_objs['Truffle Chocolates'],
                'short_description': 'Velvety gianduja truffles rolled in roasted hazelnut praline.',
                'description': 'Each truffle contains a whole slow-roasted Turkish hazelnut cocooned in silky smooth dark-milk chocolate hazelnut ganache, coated in crisp wafer crisps and rich chocolate.',
                'ingredients': 'Roasted Hazelnuts (38%), Cocoa Mass, Cocoa Butter, Whole Milk Powder, Natural Hazelnut Oil, Vanilla.',
                'price': 399.00,
                'original_price': 449.00,
                'weight': '150g (8 Pcs)',
                'image_url': 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=800&q=80',
                'stock_quantity': 35,
                'is_bestseller': True,
                'is_featured': True,
                'rating': 4.9,
                'review_count': 84,
            },
            {
                'name': 'Chocolate Almonds',
                'category': cat_objs['Nut Chocolates'],
                'short_description': 'Crunchy California roasted almonds coated in thick Belgian milk chocolate.',
                'description': 'Selected jumbo California almonds, flame roasted to golden perfection, then tumbled in layer after layer of rich, velvety milk chocolate and lightly dusted with cocoa.',
                'ingredients': 'Slow-roasted Whole Almonds (45%), Belgian Milk Chocolate (Cocoa Butter, Whole Milk Powder, Cocoa Mass, Sugar).',
                'price': 349.00,
                'original_price': 399.00,
                'weight': '200g Pouch',
                'image_url': 'https://images.unsplash.com/photo-1575372587186-50020b3a7a97?auto=format&fit=crop&w=800&q=80',
                'stock_quantity': 50,
                'is_bestseller': True,
                'is_featured': True,
                'rating': 4.9,
                'review_count': 103,
            },
            {
                'name': 'Premium Gift Box',
                'category': cat_objs['Gift Boxes'],
                'short_description': 'Royal wooden keepsake box filled with 24 signature chocolate bonbons.',
                'description': 'Our flagship gift hamper. A luxurious embossed chocolate box tied with a golden satin ribbon, filled with 24 assorted truffles, caramels, nut clusters, and hand-painted ganaches.',
                'ingredients': 'Finest Cocoa Solids, Dairy Butter, Cream, Hazelnuts, Pistachios, Almonds, Natural Fruit Purees, Bourbon Vanilla.',
                'price': 899.00,
                'original_price': 1099.00,
                'weight': '450g (24 Pcs)',
                'image_url': 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=800&q=80',
                'stock_quantity': 20,
                'is_bestseller': True,
                'is_featured': True,
                'rating': 5.0,
                'review_count': 67,
            },
            {
                'name': 'Chocolate Brownies',
                'category': cat_objs['Dark Chocolate'],
                'short_description': 'Ultra-fudgy homemade dark chocolate brownies with crackly tops.',
                'description': 'Baked fresh each morning using melted 70% dark chocolate, pure butter, and organic eggs. Dense, fudgy center with a papery thin crackly crust and melted chocolate chunks.',
                'ingredients': '70% Dark Chocolate, Creamery Butter, Flour, Brown Sugar, Fresh Eggs, Sea Salt, Vanilla Extract.',
                'price': 299.00,
                'original_price': 349.00,
                'weight': '200g (4 Thick Slices)',
                'image_url': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
                'stock_quantity': 25,
                'is_bestseller': True,
                'is_featured': True,
                'rating': 4.9,
                'review_count': 79,
            },
            {
                'name': 'Classic Milk Chocolate',
                'category': cat_objs['Milk Chocolate'],
                'short_description': 'Velvety smooth Swiss-style artisanal milk chocolate bar.',
                'description': 'Crafted for true milk chocolate connoisseurs. Rich, creamy, with caramel and malty undertones that melt effortlessly on the palate.',
                'ingredients': 'Cocoa Butter (36%), Full Cream Milk Solids, Cocoa Mass, Cane Sugar, Natural Soy Lecithin, Bourbon Vanilla.',
                'price': 219.00,
                'original_price': 249.00,
                'weight': '100g Bar',
                'image_url': 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=800&q=80',
                'stock_quantity': 60,
                'is_bestseller': False,
                'is_featured': True,
                'rating': 4.7,
                'review_count': 45,
            },
            {
                'name': 'Dark Cocoa Delight',
                'category': cat_objs['Dark Chocolate'],
                'short_description': '85% intense dark chocolate with hints of dried plum and roasted oak.',
                'description': 'For dark chocolate purists. Low sugar, deep complexity, and zero bitterness due to our gentle 48-hour stone conching process.',
                'ingredients': 'Organic Cocoa Mass (85%), Cocoa Butter, Minimal Raw Cane Sugar.',
                'price': 279.00,
                'original_price': 329.00,
                'weight': '100g Bar',
                'image_url': 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=800&q=80',
                'stock_quantity': 45,
                'is_bestseller': False,
                'is_featured': False,
                'rating': 4.8,
                'review_count': 38,
            },
            {
                'name': 'Almond Bliss Bark',
                'category': cat_objs['Nut Chocolates'],
                'short_description': 'Rustic dark chocolate bark studded with caramelized sea salt almonds.',
                'description': 'Thick rustic slabs of dark chocolate generously topped with whole toasted almonds and a pinch of pink Himalayan sea salt.',
                'ingredients': 'Dark Chocolate (65%), Salted Toasted Almonds, Himalayan Pink Salt.',
                'price': 369.00,
                'original_price': 419.00,
                'weight': '160g Pack',
                'image_url': 'https://images.unsplash.com/photo-1542843137-8791a6904d14?auto=format&fit=crop&w=800&q=80',
                'stock_quantity': 30,
                'is_bestseller': False,
                'is_featured': False,
                'rating': 4.8,
                'review_count': 52,
            },
            {
                'name': 'Belgian Truffle Box',
                'category': cat_objs['Truffle Chocolates'],
                'short_description': 'Traditional Belgian cocoa-dusted ganache truffles.',
                'description': 'Infused with heavy whipping cream and dark chocolate, then hand-shaped and dusted in bitter Dutch cocoa powder.',
                'ingredients': 'Dark Chocolate, Pure Dairy Butter, Heavy Cream, Dutch Processed Cocoa Powder, Invert Sugar.',
                'price': 649.00,
                'original_price': 749.00,
                'weight': '200g (12 Pcs)',
                'image_url': 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=800&q=80',
                'stock_quantity': 25,
                'is_bestseller': False,
                'is_featured': True,
                'rating': 4.9,
                'review_count': 64,
            },
            {
                'name': 'White Chocolate Dream',
                'category': cat_objs['White Chocolate'],
                'short_description': 'Silk white chocolate bar speckled with real vanilla bean seeds.',
                'description': 'Pure Ecuadorian cocoa butter, caramelized whole milk, and fragrant whole vanilla beans create an unmistakable floral aroma.',
                'ingredients': 'Single Origin Cocoa Butter (34%), Whole Milk Powder, Cane Sugar, Ground Madagascar Vanilla Beans.',
                'price': 239.00,
                'original_price': 279.00,
                'weight': '100g Bar',
                'image_url': 'https://images.unsplash.com/photo-1621236378699-8597fee6a1ce?auto=format&fit=crop&w=800&q=80',
                'stock_quantity': 40,
                'is_bestseller': False,
                'is_featured': False,
                'rating': 4.7,
                'review_count': 32,
            },
            {
                'name': 'Coconut Chocolate Bites',
                'category': cat_objs['Milk Chocolate'],
                'short_description': 'Chewy sweet coconut centers enrobed in dark milk chocolate.',
                'description': 'Grated tropical coconut, condensed milk, and vanilla hand-rolled and dipped in silky 55% chocolate.',
                'ingredients': 'Desiccated Coconut, Dark Milk Chocolate, Condensed Milk, Glucose, Sea Salt.',
                'price': 289.00,
                'original_price': 329.00,
                'weight': '180g (10 Pcs)',
                'image_url': 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&w=800&q=80',
                'stock_quantity': 35,
                'is_bestseller': False,
                'is_featured': False,
                'rating': 4.6,
                'review_count': 29,
            },
            {
                'name': 'Caramel Filled Bonbons',
                'category': cat_objs['Truffle Chocolates'],
                'short_description': 'Gooey salted butter caramel enclosed in glossy dark chocolate shells.',
                'description': 'Crisp tempered chocolate domes that burst with warm, slow-simmered artisanal golden caramel and sea salt.',
                'ingredients': 'Dark Chocolate 60%, Salted Butter Caramel (Sugar, Heavy Cream, Salted Butter, Fleur de Sel).',
                'price': 379.00,
                'original_price': 429.00,
                'weight': '160g (8 Pcs)',
                'image_url': 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=800&q=80',
                'stock_quantity': 40,
                'is_bestseller': False,
                'is_featured': True,
                'rating': 4.9,
                'review_count': 56,
            },
            {
                'name': 'Assorted Celebration Hamper',
                'category': cat_objs['Gift Boxes'],
                'short_description': 'Grand festival collection of handcrafted chocolates, nuts & brownie slices.',
                'description': 'The ultimate Cocoa Bliss experience. Includes 16 assorted truffles, 1 pouch of chocolate almonds, 2 brownies, and 1 dark chocolate bar, wrapped in festive luxury packaging.',
                'ingredients': 'Assorted Handcrafted Chocolates, Roasted Almonds, Brownie Bites, Cocoa Nibs, Natural Vanilla.',
                'price': 1199.00,
                'original_price': 1499.00,
                'weight': '600g Grand Hamper',
                'image_url': 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80',
                'stock_quantity': 15,
                'is_bestseller': True,
                'is_featured': True,
                'rating': 5.0,
                'review_count': 88,
            },
        ]

        created_products = []
        for pdata in products_data:
            p, _ = Product.objects.update_or_create(
                name=pdata['name'],
                defaults={
                    'category': pdata['category'],
                    'short_description': pdata['short_description'],
                    'description': pdata['description'],
                    'ingredients': pdata['ingredients'],
                    'price': pdata['price'],
                    'original_price': pdata.get('original_price'),
                    'weight': pdata['weight'],
                    'image_url': pdata['image_url'],
                    'stock_quantity': pdata['stock_quantity'],
                    'is_available': True,
                    'is_bestseller': pdata['is_bestseller'],
                    'is_featured': pdata['is_featured'],
                    'rating': pdata['rating'],
                    'review_count': pdata['review_count'],
                }
            )
            created_products.append(p)

        self.stdout.write(self.style.SUCCESS(f" Seeded {len(created_products)} chocolate products."))

        # 5. Seed realistic reviews
        sample_reviews = [
            ("Assorted Chocolate Box", customer_user, 5, "The best homemade chocolates I've ever tasted! The hazelnut and dark ganache were exceptional. Packing is so luxurious!"),
            ("Assorted Chocolate Box", reviewer1, 5, "Ordered this for my anniversary, and my partner fell in love with it. Will order again!"),
            ("Dark Chocolate Bar", customer_user, 5, "Authentic dark chocolate with no artificial aftertaste. Perfect snap and rich aroma."),
            ("Dark Chocolate Bar", reviewer2, 4, "Slightly bitter for some, but for dark chocolate lovers this is pure heaven!"),
            ("Hazelnut Truffles", reviewer1, 5, "Melt in mouth goodness! Better than imported commercial brands."),
            ("Chocolate Almonds", customer_user, 5, "Crispy roasted almonds coated in thick chocolate. Addictive snack!"),
            ("Premium Gift Box", reviewer2, 5, "Spectacular gift box. Looked like a million bucks and taste is 10/10."),
            ("Chocolate Brownies", customer_user, 5, "Super fudgy and decadent! Warmed it for 15 seconds in microwave with vanilla ice cream. Divine!"),
        ]

        for p_name, u, rating, comment in sample_reviews:
            try:
                prod = Product.objects.get(name=p_name)
                Review.objects.update_or_create(
                    product=prod,
                    user=u,
                    defaults={'rating': rating, 'comment': comment}
                )
            except Product.DoesNotExist:
                pass

        # 6. Seed Sample Demonstration Orders
        if not Order.objects.filter(user=customer_user).exists():
            assorted = Product.objects.filter(name='Assorted Chocolate Box').first()
            almonds = Product.objects.filter(name='Chocolate Almonds').first()

            if assorted and almonds:
                # Order 1: Delivered
                order1 = Order.objects.create(
                    user=customer_user,
                    customer_name=customer_user.full_name,
                    customer_email=customer_user.email,
                    customer_phone=customer_user.phone,
                    shipping_address=customer_user.address,
                    city=customer_user.city,
                    state=customer_user.state,
                    postal_code=customer_user.postal_code,
                    subtotal=assorted.price + almonds.price,
                    delivery_charge=0,
                    total_amount=assorted.price + almonds.price,
                    payment_method='upi',
                    payment_status='completed',
                    order_status='delivered',
                    notes='Please ring bell on arrival.'
                )
                OrderItem.objects.create(
                    order=order1, product=assorted,
                    product_name_snapshot=assorted.name, product_image_snapshot=assorted.image_url,
                    product_weight_snapshot=assorted.weight, unit_price=assorted.price,
                    quantity=1, subtotal=assorted.price
                )
                OrderItem.objects.create(
                    order=order1, product=almonds,
                    product_name_snapshot=almonds.name, product_image_snapshot=almonds.image_url,
                    product_weight_snapshot=almonds.weight, unit_price=almonds.price,
                    quantity=1, subtotal=almonds.price
                )

                # Order 2: Preparing / Confirmed
                truffles = Product.objects.filter(name='Hazelnut Truffles').first()
                if truffles:
                    order2 = Order.objects.create(
                        user=customer_user,
                        customer_name=customer_user.full_name,
                        customer_email=customer_user.email,
                        customer_phone=customer_user.phone,
                        shipping_address=customer_user.address,
                        city=customer_user.city,
                        state=customer_user.state,
                        postal_code=customer_user.postal_code,
                        subtotal=truffles.price,
                        delivery_charge=99,
                        total_amount=truffles.price + 99,
                        payment_method='cod',
                        payment_status='pending',
                        order_status='preparing',
                        notes='Gift packaging requested.'
                    )
                    OrderItem.objects.create(
                        order=order2, product=truffles,
                        product_name_snapshot=truffles.name, product_image_snapshot=truffles.image_url,
                        product_weight_snapshot=truffles.weight, unit_price=truffles.price,
                        quantity=1, subtotal=truffles.price
                    )

                # Add sample notification
                Notification.objects.create(
                    user=customer_user,
                    title="Welcome to Cocoa Bliss! 🤎",
                    message="Enjoy a sweet journey with 100% handcrafted homemade chocolates made with love.",
                    link="/shop"
                )

            self.stdout.write(self.style.SUCCESS(" Seeded sample customer orders and notifications."))

        self.stdout.write(self.style.SUCCESS("[SUCCESS] Cocoa Bliss database seeding completed successfully!"))

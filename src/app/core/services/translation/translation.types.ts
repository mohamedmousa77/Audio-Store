/**
 * Translation system type definitions
 * Provides type safety for language selection and translation keys
 */

export type Language = 'it' | 'en';

export interface Translations {
    common: {
        yes: string;
        no: string;
        save: string;
        cancel: string;
        delete: string;
        edit: string;
        add: string;
        remove: string;
        close: string;
        confirm: string;
        loading: string;
        error: string;
        success: string;
        hello: string;
        continueShopping: string;
    };
    header: {
        logoText: string;
        searchPlaceholder: string;
        account: string;
        cart: string;
        menu: string;
        home: string;
        support: string;
    };
    hero: {
        shopNow: string;
        learnMore: string;
    };
    featured: {
        title: string;
        viewAll: string;
    };
    categorySection: {
        title: string;
        exploreCategory: string;
        emptyCategoryTitle: string;
        emptyCategorySubtitle: string;
        backToHomepage: string;
        sortTitle: string;
        sortOptions: {
            featured: string;
            priceLowHigh: string;
            priceHighLow: string;
            newest: string;
        };
        filterTitle: string;
        filterByBrand: string;
    };
    newsletterSignup: {
        title: string;
        subtitle: string;
        emailPlaceholder: string;
        submitButton: string;
        successMessage: string;
    };
    product: {
        addToCart: string;
        viewDetails: string;
        outOfStock: string;
        inStock: string;
        price: string;
        description: string;
        specifications: string;
        reviews: string;
        addedToCart: string;
        bestSeller: string;
        new: string;
        save: string;
        only: string;
        piecesAvailable: string;
        color: string;
        battery: string;
        wireless: string;
    };
    cart: {
        title: string;
        subtitle: string;
        subtitleCartItems: string;
        emptyCart: string;
        emptyCartMessage: string;
        continueShopping: string;
        checkout: string;
        subtotal: string;
        total: string;
        quantity: string;
        product: string;
        unitPrice: string;
        remove: string;
        updateCart: string;
        clearCartConfirmation: {
            title: string;
            message: string;
            confirmText: string;
            cancelText: string;
        }
        removeItemConfirmation: {
            title: string;
            message: string;
            confirmText: string;
            cancelText: string;
        }
        
    };
    checkout: {
        title: string;
        shippingAddress: string;
        paymentMethod: string;
        orderSummary: string;
        placeOrder: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        zipCode: string;
        country: string;
        selected: string;
        shipping: string;
        free: string;
        orderTotal: string;
        includesTaxes: string;
        confirmOrder: string;
        secure: string;
        insured: string;
        support: string;
        errors: {
            firstNameRequired: string;
            lastNameRequired: string;
            emailRequired: string;
            phoneRequired: string;
            addressRequired: string;
            zipCodeRequired: string;
            cityRequired: string;            
        }
        defaultPaymentMethod: string;
        paymentMessage: string;

    };
    orders: {
        title: string;
        orderNotFound: string;
        orderNotFoundMessage: string;
        thankYou: string;
        confirmationEmailSent: string;
        orderPlaced: string;
        successfully: string;
        returnToShopping: string;
        downloadInvoice: string;
        itemsOrdered: string;
        items: string;
        payUponReceipt: string;
        taxEst: string;
        orderStatus: string;
        orderNumber: string;
        orderDate: string;
        status: string;
        total: string;
        viewDetails: string;
        noOrders: string;
        pending: string;
        processing: string;
        shipped: string;
        delivered: string;
        cancelled: string;
    };
    auth: {
        login: string;
        register: string;
        logout: string;
        email: string;
        password: string;
        confirmPassword: string;
        forgotPassword: string;
        rememberMe: string;
        noAccount: string;
        haveAccount: string;
        signUp: string;
        signIn: string;
        loginSubtitle: string;
        registrationSubtitle: string;
        registrationImageTitle: string;
        and: string;
        Privacy: string;
        Terms: string;
        TermsAndCoditionsAgree: string;
    };
    profile: {
        title: string;
        hello: string;
        memberSince: string;
        personalInfo: string;
        myAddresses: string;
        orderHistory: string;
        addresses: string;
        settings: string;
        editProfile: string;
        changePassword: string;
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        saveChanges: string;
        personalInfoSection: {
            title: string;
            subtitle: string;
            editButton: string;
            errors: {
                firstNameRequired: string;
                firstNameMinLength: string;
                lastNameRequired: string;
                lastNameMinLength: string;
                emailRequired: string;
                emailInvalid: string;
                phoneRequired: string;
                phoneInvalid: string;
            };
            savePersonalInfo: {
                success: string;
                successMessage: string;
                error: string;
                errorMessage: string;
                saveButton: string;
                saveLoading: string;
                cancelButton: string;
            }
        }
        addressSection: {
            title: string;
            subtitle: string; 
            addAddressButton: string;
            loading: string;    
            defaultBadge: string;
            setDefaultTitle: string;
            setDefaultButton: string;
            editTitle: string;
            editButton: string;
            deleteTitle: string;
            deleteButton: string;
            confirmDelete: string;
            addingForm: {
                street: string; 
                city: string; 
                zipCode: string; 
                country: string; 
                countryPlaceholder: string;
            }
            success: string;
            successMessage: string;
            error: string;
            errorMessage: string;
            errors: {
                countryRequired: string;
                postalCodeRequired: string;
                postalCodePattern: string;
                streetRequired: string;
                streetMinLength: string;
                cityRequired: string; 
                cityMinLength: string;
                setDefaultFailed: string;
                saveFailed: string;
                deleteFailed: string;
                loadFailed: string;
            }
            saveButton: string;
            saveLoading: string;
            cancelButton: string;
            emptyState: {
                emptyTitle: string;
                emptyMessage: string;
                emptyButton: string;
            }
            removeConfirmation:{
                title: string;
                message: string;
                confirmText: string;
                cancelText: string;
            }
        }
        ordersSection: {
            title: string;
            subtitle: string;
            dateFilter:{
                datefilterTitle: string;
                allOrders: string;
                Today: string;
                Settimana: string;
                Mese: string;
            }
            statuses: {
                pending: string;
                confirmed: string;
                shipped: string;
                delivered: string;
                cancelled: string;
                unknown: string;
            }
        }
        
    };
    productDetails: {
        addToCart: string;
        buyNow: string;
        description: string;
        specifications: string;
        reviews: string;
        relatedProducts: string;
        inStock: string;
        outOfStock: string;
        quantity: string;
        sku: string;
        category: string;
        brand: string;
        productDescription: string;
        keyFeatures: string;
        youMayAlsoLike: string;
    };
    admin: {
        headerTitle: string;
        dashboard: string;
        products: string;
        categories: string;
        orders: string;
        customers: string;
        signOut: string;
        settings: string;
        addNew: string;
        edit: string;
        delete: string;
        save: string;
        cancel: string;
        search: string;
        filter: string;
        export: string;
        import: string;
               
    };
    dashboard: {
        header: {
            title: string;
            subtitle: string;
        }
    };
    productsManagement: {
        header: {
            title: string;
            subtitle: string; 
        }
    };
    categoriesManagement: {
        header: {
            title: string;
            subtitle: string; 
        }
    };
    ordersManagement: {
        header: {
            title:string;
            subtitle: string;
        }
    };
    customersManagement: {
        header: {
            title: string; 
            subtitle: string;
        }
    };
    footer: {
        aboutUs: string;
        contactUs: string;
        privacyPolicy: string;
        termsOfService: string;
        followUs: string;
        copyright: string;
    };
    errors: {
        generic: string;
        notFound: string;
        serverError: string;
        unauthorized: string;
        invalidInput: string;
        networkError: string;
    };
}

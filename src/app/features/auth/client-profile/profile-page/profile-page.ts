import { Component, OnInit, OnDestroy, ViewChild, ViewChildren, QueryList, ElementRef, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthServices } from '../../../../core/services/auth/auth-services';
import { User } from '../../../../core/models/user';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PersonalAddress } from '../components/personal-address/personal-address';
import { PersonalInfo } from '../components/personal-info/personal-info';
import { PersonalOrders } from '../components/personal-orders/personal-orders';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  section: string;
}

@Component({
  selector: 'app-profile-page',
  imports: [
    CommonModule,
    PersonalAddress,
    PersonalInfo,
    PersonalOrders
  ],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage implements OnInit, OnDestroy, AfterViewInit{
  @ViewChild('personalInfoSection') personalInfoSection!: ElementRef;
  @ViewChild('addressSection') addressSection!: ElementRef;
  @ViewChild('ordersSection') ordersSection!: ElementRef;
  @ViewChildren('section') sections!: QueryList<ElementRef>;

  currentUser: User | null = null;
  activeMenu = 'personal-info';
  memberSince: string = 'Member since registration:';

  menuItems: MenuItem[] = [
    {
      id: 'personal-info',
      label: 'Personal Data',
      icon: 'person',
      section: 'personalInfoSection',
    },
    {
      id: 'address',
      label: 'My Addresses',
      icon: 'location_on',
      section: 'addressSection',
    },
    {
      id: 'orders',
      label: 'Order History',
      icon: 'receipt',
      section: 'ordersSection',
    },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthServices,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    // Carica l'utente corrente
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          this.currentUser = user;
          this.calculateMemberSince();
        } else {
          // FOR DEVELOPMENT/TESTING: Comment out the redirect to test profile page
          // if (!user) {
          //   this.router.navigate(['/auth/login']);
          // }
          console.warn('No user found - profile page loaded for testing');
        }
      });
  }

  ngAfterViewInit(): void {
    // Set up intersection observer to detect active section on scroll
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-40% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      // Run inside Angular zone to trigger change detection
      this.ngZone.run(() => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            const menuItem = this.menuItems.find(item => item.section === sectionId);
            if (menuItem) {
              this.activeMenu = menuItem.id;
              console.log('Active menu updated to:', this.activeMenu);
            }
          }
        });
      });
    }, observerOptions);

    // Observe all sections
    const sections = [
      this.personalInfoSection,
      this.addressSection,
      this.ordersSection
    ];

    sections.forEach((section, index) => {
      if (section && section.nativeElement) {
        section.nativeElement.id = this.menuItems[index]?.section || '';
        observer.observe(section.nativeElement);
      }
    });

    this.destroy$.subscribe(() => observer.disconnect());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private calculateMemberSince(): void {
    
    // if (!this.currentUser?.registrationDate) {
    //   this.memberSince = 'Member since registration';
    //   return;
    // }

    const createdDate = '2023-01-15'; // Placeholder date for testing
    const createdDateObj = new Date(createdDate);
    const now = new Date();
    const months = this.getMonthsBetween(createdDateObj, now);

    if (months === 0) {
      this.memberSince = 'Member since this month';
    } else if (months === 1) {
      this.memberSince = 'Member since 1 month ago';
    } else {
      this.memberSince = `Member since ${months} months ago`;
    }
  }

  private getMonthsBetween(d1: Date, d2: Date): number {
    return d2.getMonth() - d1.getMonth() + (d2.getFullYear() - d1.getFullYear()) * 12;
  }


  navigateToSection(menuItem: MenuItem): void {
    this.activeMenu = menuItem.id;
    setTimeout(() => {
      const section = this[menuItem.section as keyof this] as ElementRef;
      if (section && section.nativeElement) {
        section.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 100);
  }

  /**
   * Logout
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  /**
   * Ottieni le iniziali dell'utente
   */
  getInitials(): string {
    if (!this.currentUser) return '';
    return (
      this.currentUser.firstName.charAt(0) + this.currentUser.lastName.charAt(0)
    ).toUpperCase();
  }

  /**
   * Ottieni il nome completo
   */
  getFullName(): string {
    if (!this.currentUser) return '';
    return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
  }

  continueShopping(): void {
    this.router.navigate(['/client/home']);
  }

}

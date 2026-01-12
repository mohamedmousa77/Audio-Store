import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminSidebar } from '../../layout/admin-sidebar/admin-sidebar';
import { AdminHeader } from '../../layout/admin-header/header';
import { User } from '../../../../core/models/user';
@Component({
  selector: 'app-customers-page',
  imports: [
    CommonModule,
    FormsModule,
    AdminSidebar,
    AdminHeader
  ],
  templateUrl: './customers-page.html',
  styleUrl: './customers-page.css',
})
export class CustomersPage implements OnInit {

  customers: User[] = [
      {
        id: '1',
        name: 'Alex Morgan',
        firstName: 'Alex',
        lastName: 'Morgan',
        email: 'alex.m@example.com',
        phone: '+39 320 123 4567',
        registrationDate: '2023-06-15',
        totalOrders: 12,
        lastOrderDate: '2024-01-15',
        initials: 'AM',
        color: '#FF6B6B',
        ruole: 'Customer'      
      },
      {
        id: '2',
        name: 'Sarah Jenkins',
        firstName: 'Sarah',
        lastName: 'Jenkins',
        email: 's.jenkins@test.com',
        phone: '+39 333 456 7890',
        registrationDate: '2023-08-22',
        totalOrders: 8,
        lastOrderDate: '2024-01-14',
        initials: 'SJ',
        color: '#4ECDC4',
        ruole: 'Customer'
      },
      {
        id: '3',
        name: 'Michael Chen',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'mchen88@gmail.com',
        phone: '+39 345 789 0123',
        registrationDate: '2023-09-10',
        totalOrders: 15,
        lastOrderDate: '2024-01-14',
        initials: 'MC',
        color: '#45B7D1',
        ruole: 'Customer'
      },
      {
        id: '4',
        name: 'Emily Miller',
        firstName: 'Emily',
        lastName: 'Miller',
        email: 'emily.m@studio.com',
        phone: '+39 366 234 5678',
        registrationDate: '2023-11-05',
        totalOrders: 5,
        lastOrderDate: '2024-01-13',
        initials: 'EM',
        color: '#FFA07A',
        ruole: 'Customer'
      },
      {
        id: '5',
        name: 'James Wilson',
        firstName: 'James',
        lastName: 'Wilson',
        email: 'james.w@music.com',
        phone: '+39 380 567 8901',
        registrationDate: '2024-01-01',
        totalOrders: 3,
        lastOrderDate: '2024-01-13',
        initials: 'JW',
        color: '#98D8C8',
        ruole: 'Customer'
      },
      {
        id: '6',
        name: 'Lisa Brown',
        firstName: 'Lisa',
        lastName: 'Brown',
        email: 'lisa.b@pro.com',
        phone: '+39 391 890 1234',
        registrationDate: '2023-07-20',
        totalOrders: 22,
        lastOrderDate: '2024-01-12',
        initials: 'LB',
        color: '#F7DC6F',
        ruole: 'Customer'
      },
      {
        id: '7',
        name: 'David Kumar',
        firstName: 'David',
        lastName: 'Kumar',
        email: 'david.k@audio.com',
        phone: '+39 328 345 6789',
        registrationDate: '2023-10-30',
        totalOrders: 9,
        lastOrderDate: '2024-01-10',
        initials: 'DK',
        color: '#BB8FCE',
        ruole: 'Customer'
      },
      {
        id: '8',
        name: 'Jessica Thompson',
        firstName: 'Jessica',
        lastName: 'Thompson',
        email: 'jessica.t@sound.com',
        phone: '+39 320 456 7890',
        registrationDate: '2023-12-12',
        totalOrders: 4,
        lastOrderDate: '2024-01-08',
        initials: 'JT',
        color: '#85C1E2',
        ruole: 'Customer'
      }
  ];

  customersList: any[] = [
    {
      id: 'CUST-8922',
      name: 'Alice Freeman',
      email: 'alice.f@example.com',
      phone: '+39 320 123 4567',
      registrationDate: 'Oct 24, 2023',
      totalOrders: 12,
      lastOrderDate: 'Oct 26, 2023',
      lastOrderRelative: '2 days ago',
      initials: 'AF',
      color: '#f39c12',
      status: 'Active',
      totalSpent: 1245.00,
      avgOrder: 103.75,
      recentOrders: [
        { id: '#ORD-1234', date: 'Oct 26, 2023', items: 3, status: 'Delivered', total: 150.00 },
        { id: '#ORD-1235', date: 'Oct 20, 2023', items: 1, status: 'Shipped', total: 45.00 }
      ]
    },
    {
      id: 'CUST-8923',
      name: 'Bob Smith',
      email: 'bob.smith@email.com',
      phone: '+39 333 456 7890',
      registrationDate: 'Sep 12, 2023',
      totalOrders: 3,
      lastOrderDate: 'Oct 15, 2023',
      lastOrderRelative: '13 days ago',
      initials: 'BS',
      color: '#b2bec3',
      status: 'Active',
      totalSpent: 1245.00,
      avgOrder: 103.75,
      recentOrders: [
        { id: '#ORD-1234', date: 'Oct 26, 2023', items: 3, status: 'Delivered', total: 150.00 },
        { id: '#ORD-1235', date: 'Oct 20, 2023', items: 1, status: 'Shipped', total: 45.00 }
      ]
    },
    {
      id: 'CUST-8924',
      name: 'Charlie Brown',
      email: 'charlie.b@test.com',
      phone: '+39 345 789 0123',
      registrationDate: 'Aug 05, 2023',
      totalOrders: 0,
      lastOrderDate: 'No orders yet',
      lastOrderRelative: '',
      initials: 'CB',
      color: '#b2bec3',
      status: 'Active',
      totalSpent: 1245.00,
      avgOrder: 103.75,
      recentOrders: [
        { id: '#ORD-1234', date: 'Oct 26, 2023', items: 3, status: 'Delivered', total: 150.00 },
        { id: '#ORD-1235', date: 'Oct 20, 2023', items: 1, status: 'Shipped', total: 45.00 }
      ]
    },
    {
      id: 'CUST-8925',
      name: 'Emily Miller',
      email: 'emily.m@studio.com',
      phone: '+39 366 234 5678',
      registrationDate: 'Jul 22, 2023',
      totalOrders: 24,
      lastOrderDate: 'Oct 27, 2023',
      lastOrderRelative: 'Just now',
      initials: 'EM',
      color: '#b2bec3',
      status: 'Active',
      totalSpent: 1245.00,
      avgOrder: 103.75,
      recentOrders: [
        { id: '#ORD-1234', date: 'Oct 26, 2023', items: 3, status: 'Delivered', total: 150.00 },
        { id: '#ORD-1235', date: 'Oct 20, 2023', items: 1, status: 'Shipped', total: 45.00 }
      ]
    }
  ];
  
  filteredCustomers: any[] = [];
  
  selectedRegistrationSort = 'newest';
  selectedOrdersRange = 'all';
  selectedLastOrderFilter = 'any';

  
  searchTerm = '';
  selectedSort = 'recent';
  showDetailModal = false;
  selectedCustomer: any | null = null;

  ngOnInit(): void {
    this.filteredCustomers = [...this.customersList];
    this.applySort();
    this.selectedCustomer = this.customersList[0];
  }

  selectCustomer(customer: any): void {
    this.selectedCustomer = customer;
    setTimeout(() => {
      const element = document.getElementById('customer-detail-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
  
  getActiveCustomers(): number {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  return this.customersList.filter(c => new Date(c.lastOrderDate) > oneMonthAgo).length;
  }

  getTotalOrders(): number {
    return this.customersList.reduce((sum, c) => sum + c.totalOrders, 0);
  }

  getTopCustomer(): string {
    if (this.customersList.length === 0) return 'N/A';
    const topCustomer = this.customersList.reduce((max, c) =>
      c.totalOrders > max.totalOrders ? c : max
    );
    return topCustomer.name.split(' ')[0]; // Solo il nome
  }


  applyFilters(): void {
    // this.filteredCustomers = this.customersList.filter(customer => {
    //   return customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
    //          customer.email.toLowerCase().includes(this.searchTerm.toLowerCase());
    // });
    // this.applySort();

    this.filteredCustomers = this.customersList.filter(customer => 
    {
      // 1. Filtro Ricerca (Search Bar)
      const matchesSearch = 
        customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      // 2. Filtro Range Ordini (Total Orders)
      let matchesOrders = true;
      if (this.selectedOrdersRange === 'none') matchesOrders = customer.totalOrders === 0;
      else if (this.selectedOrdersRange === '1-10') matchesOrders = customer.totalOrders >= 1 && customer.totalOrders <= 10;
      else if (this.selectedOrdersRange === '10+') matchesOrders = customer.totalOrders > 10;

      // 3. Filtro Ultimo Ordine (Last Order)
      let matchesLastOrder = true;
      const now = new Date();
      const lastOrderDate = new Date(customer.lastOrderDate);
      if (this.selectedLastOrderFilter === 'recent') {
        const thirtyDaysAgo = new Date().setDate(now.getDate() - 30);
        matchesLastOrder = lastOrderDate.getTime() >= thirtyDaysAgo;
      } else if (this.selectedLastOrderFilter === 'inactive') {
        const sixMonthsAgo = new Date().setMonth(now.getMonth() - 6);
        matchesLastOrder = lastOrderDate.getTime() < sixMonthsAgo || !customer.lastOrderDate;
      }

      return matchesSearch && matchesOrders && matchesLastOrder;
    });

  // 4. Ordinamento per Data Registrazione
  this.applyRegistrationSort();
}

  applyRegistrationSort(): void {
    if (this.selectedRegistrationSort === 'newest') {
      this.filteredCustomers.sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());
    } else {
      this.filteredCustomers.sort((a, b) => new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime());
    }
  }

  applySort(): void {
    switch (this.selectedSort) {
      case 'recent':
        this.filteredCustomers.sort((a, b) => 
          new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime()
        );
        break;
      case 'alphabetical':
        this.filteredCustomers.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'orders':
        this.filteredCustomers.sort((a, b) => b.totalOrders - a.totalOrders);
        break;
      case 'registered':
        this.filteredCustomers.sort((a, b) => 
          new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
        );
        break;
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filteredCustomers = [...this.customersList];
    this.applySort();
  }

  viewCustomerDetails(customer: User): void {
    this.selectedCustomer = customer;
    this.showDetailModal = true;
  }

  closeModal(): void {
    this.showDetailModal = false;
    this.selectedCustomer = null;
  }

  deleteCustomer(customer: User): void {
    if (confirm(`Are you sure you want to delete customer ${customer.name}?`)) {
      this.customersList = this.customersList.filter(c => c.id !== customer.id);
      this.applyFilters();
    }
  }

  exportCustomers(): void {
    console.log('Exporting customers...');
    // Implementare in futuro
  }

}

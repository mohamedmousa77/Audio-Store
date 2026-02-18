import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../../core/models/category';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit {
  @Input() productData: any;
  @Input() categories: Category[] = [];

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  validationErrors: { [key: string]: string } = {};

  ngOnInit(): void {
    if (!this.productData) {
      this.productData = {
        name: '',
        brand: '',
        description: '',
        specifications: '',
        price: 0,
        stockQuantity: 0,
        categoryId: null,
        mainImage: '',
        galleryImages: [],
        isNew: false,
        isFeatured: false,
        isAvailable: true
      };
    }
  }

  onSave() {
    this.validationErrors = {};

    if (!this.productData.name?.trim()) {
      this.validationErrors['name'] = 'Product name is required';
    }
    if (!this.productData.categoryId) {
      this.validationErrors['categoryId'] = 'Category is required';
    }
    if (!this.productData.price || this.productData.price <= 0) {
      this.validationErrors['price'] = 'Price must be greater than 0';
    }

    if (Object.keys(this.validationErrors).length > 0) {
      return; // Don't submit
    }

    this.save.emit(this.productData);
  }
  onCancel() { this.cancel.emit(); }

  onMainImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.compressImage(input.files[0], 800).then(compressed => {
        this.productData.mainImage = compressed;
      });
    }
  }

  onGalleryImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.compressImage(input.files[0], 400).then(compressed => {
        if (!this.productData.galleryImages) {
          this.productData.galleryImages = [];
        }
        this.productData.galleryImages.push(compressed);
      });
    }
  }

  removeGalleryImage(index: number): void {
    this.productData.galleryImages?.splice(index, 1);
  }

  /**
   * Compress and resize an image file using Canvas API.
   * Outputs JPEG at 0.7 quality, resized to fit within maxSize x maxSize.
   * This prevents storing huge base64 strings in the DB,
   * which would make API list responses extremely large and slow.
   */
  private compressImage(file: File, maxSize: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Scale down if larger than maxSize
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            } else {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, width, height);

          // Encode as JPEG with 0.7 quality (~20-40KB for typical photos)
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

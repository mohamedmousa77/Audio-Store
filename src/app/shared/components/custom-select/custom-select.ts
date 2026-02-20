import { Component, Input, Output, EventEmitter, signal, computed, HostListener, ElementRef, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export interface SelectOption {
    value: any;
    label: string;
}

@Component({
    selector: 'app-custom-select',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './custom-select.html',
    styleUrls: ['./custom-select.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CustomSelectComponent),
            multi: true
        }
    ]
})
export class CustomSelectComponent implements ControlValueAccessor {
    @Input() options: SelectOption[] = [];
    @Input() placeholder = 'Select...';

    isOpen = signal(false);
    selectedValue = signal<any>(null);

    private onChange: (value: any) => void = () => { };
    private onTouched: () => void = () => { };

    constructor(private elementRef: ElementRef) { }

    selectedLabel = computed(() => {
        const val = this.selectedValue();
        const found = this.options.find(o => o.value === val || String(o.value) === String(val));
        return found ? found.label : this.placeholder;
    });

    isSelected(option: SelectOption): boolean {
        const val = this.selectedValue();
        return option.value === val || String(option.value) === String(val);
    }

    toggleDropdown(): void {
        this.isOpen.update(v => !v);
    }

    selectOption(option: SelectOption): void {
        this.selectedValue.set(option.value);
        this.onChange(option.value);
        this.onTouched();
        this.isOpen.set(false);
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen.set(false);
        }
    }

    // ControlValueAccessor
    writeValue(value: any): void {
        this.selectedValue.set(value);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
}

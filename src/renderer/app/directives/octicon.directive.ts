import { Directive, Input, OnInit, ElementRef, Renderer2 } from '@angular/core'
import * as octicons from 'octicons'

@Directive({
    selector: '[octicon]'
})
export class OcticonDirective implements OnInit {
    @Input() octicon: string
    @Input() color: string
    @Input() width: number

    constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

    ngOnInit(): void {
        const element: HTMLElement = this.elementRef.nativeElement
        element.innerHTML = octicons[this.octicon].toSVG()

        if (element.firstChild) {
            const icon: Node = element.firstChild

            if (this.color) {
                this.renderer.setStyle(icon, 'color', this.color)
            }
            if (this.width) {
                this.renderer.setStyle(icon, 'width', this.width)
                this.renderer.setStyle(icon, 'height', '100%')
            }
        }
    }

}

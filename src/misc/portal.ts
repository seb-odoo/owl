import { Component } from "../component/component";
import { VNode } from "../vdom/index";
import { xml } from "../tags";

/**
 * Portal
 *
 * The Portal component allows to render a part of a component outside it's DOM.
 * It is for example useful for dialogs: for css reasons, dialogs are in general
 * placed in a specific spot of the DOM (e.g. directly in the body). With the
 * Portal, a component can conditionally specify in its tempate that it contains
 * a dialog, and where this dialog should be inserted in the DOM.
 *
 * The Portal component ensures that the communication between the content of
 * the Portal and its parent properly works: events reaching the Portal are
 * re-triggered on an empty <portal> node located in the parent's DOM.
 */

export class Portal extends Component<any, any> {
  static template = xml`<portal><t t-slot="default"/></portal>`;
  // TODO: props validation

  portal: VNode | null = null;
  target: HTMLElement | null = null;

  __callMounted() {
    const vnode = this.__owl__.vnode!;
    console.log('PORTAL VNODE', vnode)
    super.__callMounted();

    const children = vnode.children!;
    if (children.length !== 1) {
      throw new Error(`Portal must have exactly one child (has ${children.length})`);
    }

    this.target = document.querySelector(this.props.target);
    if (!this.target) {
      throw new Error(`Could not find any match for "${this.props.target}"`);
    } else {
      this.portal = (children[0] as VNode);
      this.target.appendChild(this.el!.firstChild!);
    }
  }

  __destroy(parent) {
    if (this.portal) {
        document.querySelector(this.props.target).removeChild(this.portal.elm!);
    }
    super.__destroy(parent);
  }
}

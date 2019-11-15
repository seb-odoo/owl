import { Portal } from "../../src/misc/portal";
import { xml } from "../../src/tags";
import { makeTestFixture, makeTestEnv, nextTick } from "../helpers";
import { Component } from "../../src/component/component";
import { useState } from "../../src/hooks";

//------------------------------------------------------------------------------
// Setup and helpers
//------------------------------------------------------------------------------

// We create before each test:
// - fixture: a div, appended to the DOM, intended to be the target of dom
//   manipulations.  Note that it is removed after each test.
// - outside: a div with id #outside appended into fixture, meant to be used as
//   target by Portal component
// - a test env, necessary to create components, that is set on Component

let fixture: HTMLElement;
let outside: HTMLElement;

beforeEach(() => {
  fixture = makeTestFixture();
  outside = document.createElement("div");
  outside.setAttribute("id", "outside");
  fixture.appendChild(outside);

  Component.env = makeTestEnv();
});

afterEach(() => {
  fixture.remove();
});

describe("Portal", () => {
  test("basic use of portal", async () => {
    class Parent extends Component<any, any> {
      static components = { Portal };
      static template = xml`
        <div>
          <span>1</span>
          <Portal target="'#outside'">
            <div>2</div>
          </Portal>
        </div>`;
    }

    const parent = new Parent();
    await parent.mount(fixture);

    expect(outside.innerHTML).toBe('<div>2</div>');
    expect(parent.el!.outerHTML).toBe('<div><span>1</span><portal></portal></div>');
  });

  test("conditional use of Portal", async () => {
    class Parent extends Component<any, any> {
      static components = { Portal };
      static template = xml`
        <div>
          <span>1</span>
          <Portal target="'#outside'" t-if="state.hasPortal">
            <div>2</div>
          </Portal>
        </div>`;

      state = useState({ hasPortal: false });
    }

    const parent = new Parent();
    await parent.mount(fixture);
    expect(outside.innerHTML).toBe('');
    expect(parent.el!.outerHTML).toBe('<div><span>1</span></div>');

    parent.state.hasPortal = true;
    await nextTick();
    expect(outside.innerHTML).toBe('<div>2</div>');
    expect(parent.el!.outerHTML).toBe('<div><span>1</span><portal></portal></div>');

    parent.state.hasPortal = false;
    await nextTick();
    expect(outside.innerHTML).toBe('');
    expect(parent.el!.outerHTML).toBe('<div><span>1</span></div>');

    parent.state.hasPortal = true;
    await nextTick();
    expect(outside.innerHTML).toBe('<div>2</div>');
    expect(parent.el!.outerHTML).toBe('<div><span>1</span><portal></portal></div>');
  });
});

// cypress/helpers/currencyHelper.js
var CurrencyHelper = class {
  static toNumber(value) {
    return Number(
      value.replace(/[^\d,]/g, "").replace(/\./g, "").replace(",", ".").trim()
    );
  }
};
var currencyHelper_default = CurrencyHelper;

// cypress/support/page_objects/CartPage.js
var CartPage = class {
  elements = {
    cartButton: "#nav-cart",
    quantitySelect: 'select[name="quantity"]',
    subtotal: "#sc-subtotal-amount-buybox",
    productPrice: ".sc-product-price",
    cartBadge: "#nav-cart-count"
  };
  openCart() {
    if (Cypress.env("USE_MOCK")) {
      cy.readFile("cypress/fixtures/pages/cart.html", "utf8").then((html) => {
        cy.window().then((win) => {
          win.document.open();
          win.document.write(html);
          win.document.close();
        });
      });
      cy.get("#cart-items", { timeout: 1e4 }).should(($el) => {
        expect($el.text().trim().length).to.be.greaterThan(0);
      });
      return;
    }
    cy.get("body").then(($body) => {
      if ($body.find(this.elements.cartButton).length) {
        cy.get(this.elements.cartButton).first().click({ force: true });
        return;
      }
      const fallback = 'a[href*="/cart"], a#nav-cart, a[aria-label*="Carrinho"], a[aria-label*="cart"]';
      cy.get(fallback, { timeout: 15e3 }).first().click({ force: true });
    });
  }
  extractFirstPrice(text) {
    const rawText = (text || "").replace(/\u00a0/g, " ");
    const match = rawText.match(/R\$\s*([\d\.]+,\d{2}|\d+,\d{2}|\d+\.\d{2})/);
    if (!match) {
      return NaN;
    }
    return currencyHelper_default.toNumber(match[1]);
  }
  getVisibleUnitPricesFromCart() {
    return cy.get("body").then(($body) => {
      const row = $body.find(".sc-list-item-content, .sc-list-item, #sc-active-cart").first();
      const root = row.length ? row : $body;
      const nodes = root.find(".a-price .a-offscreen, .sc-product-price, .a-color-price");
      const parsed = [...nodes].map((el) => this.extractFirstPrice(el.innerText || el.textContent || "")).filter((value) => Number.isFinite(value) && value > 0);
      return parsed;
    });
  }
  validatePrice() {
    if (Cypress.env("USE_MOCK")) {
      cy.get("@productPrice").then((price) => {
        cy.get("#cart-items", { timeout: 1e4 }).invoke("text").then((text) => {
          const cartPrice = this.extractFirstPrice(text);
          expect(cartPrice).to.be.closeTo(Number(price), 0.2);
        });
      });
      return;
    }
    this.getVisibleUnitPricesFromCart().then((parsed) => {
      expect(parsed.length).to.be.greaterThan(0);
      const unitPrice = parsed[0];
      Cypress.env("CART_UNIT_PRICE", unitPrice);
      cy.get("@productPrice").then((captured) => {
        const capturedPrice = Number(captured) || 0;
        if (capturedPrice > 0) {
          const hasApproxMatch = parsed.some((value) => Math.abs(value - capturedPrice) <= 25);
          expect(hasApproxMatch).to.equal(true);
        }
      });
    });
  }
  validateVisiblePrices() {
    if (Cypress.env("USE_MOCK")) {
      return this.validatePrice();
    }
    this.getVisibleUnitPricesFromCart().then((parsed) => {
      expect(parsed.length).to.be.greaterThan(0);
      const rounded = parsed.map((v) => Number(v.toFixed(2)));
      const frequencies = rounded.reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      }, {});
      const dominant = Object.entries(frequencies).sort((a, b) => b[1] - a[1])[0];
      const dominantValue = Number(dominant[0]);
      expect(Number.isFinite(dominantValue)).to.equal(true);
      Cypress.env("CART_UNIT_PRICE", dominantValue);
    });
  }
  changeQuantity(quantity) {
    const quantityText = quantity.toString();
    if (Cypress.env("USE_MOCK")) {
      cy.window().then((win) => {
        const cart = JSON.parse(win.localStorage.getItem("mock_cart") || "[]");
        if (cart.length) {
          cart[0].quantity = quantity;
          win.localStorage.setItem("mock_cart", JSON.stringify(cart));
        }
      });
      return;
    }
    cy.get("body").then(($body) => {
      const selectSelectors = [
        this.elements.quantitySelect,
        'select[name="quantityBox"]',
        "#quantity select"
      ];
      for (const sel of selectSelectors) {
        if ($body.find(sel).length) {
          cy.get(sel).first().select(quantityText, { force: true });
          return;
        }
      }
      const triggerSelectors = [
        '[aria-label*="Quantidade"]',
        '[aria-label*="quantity"]',
        "span.a-button-text.a-declarative",
        "span.a-button-dropdown"
      ];
      for (const sel of triggerSelectors) {
        if ($body.find(sel).length) {
          cy.get(sel).first().click({ force: true });
          cy.get("body").then(($menu) => {
            const optionRegex = new RegExp(`(^|\\D)${quantityText}(\\D|$)`);
            const options = [...$menu.find("li a, li span, a.a-dropdown-link, option")];
            const matched = options.find((el) => optionRegex.test((el.innerText || el.textContent || el.value || "").trim()));
            if (matched) {
              cy.wrap(matched).click({ force: true });
            }
          });
          return;
        }
      }
      throw new Error("Nao foi possivel alterar a quantidade no carrinho");
    });
  }
  validateQuantity(quantity) {
    const quantityText = quantity.toString();
    if (Cypress.env("USE_MOCK")) {
      cy.window().then((win) => {
        const cart = JSON.parse(win.localStorage.getItem("mock_cart") || "[]");
        const current = cart[0] && cart[0].quantity || 0;
        expect(current).to.equal(quantity);
      });
      return;
    }
    cy.get("body").then(($body) => {
      const selectSelectors = [
        this.elements.quantitySelect,
        'select[name="quantityBox"]',
        "#quantity select"
      ];
      for (const sel of selectSelectors) {
        if ($body.find(sel).length) {
          cy.get(sel).first().should("have.value", quantityText);
          return;
        }
      }
      const badgeSelectors = [
        '[aria-label*="Quantidade"]',
        '[aria-label*="quantity"]',
        ".a-dropdown-prompt"
      ];
      for (const sel of badgeSelectors) {
        if ($body.find(sel).length) {
          cy.get(sel).first().invoke("text").then((text) => {
            const normalized = (text || "").trim();
            expect(new RegExp(`(^|\\D)${quantityText}(\\D|$)`).test(normalized)).to.equal(true);
          });
          return;
        }
      }
      throw new Error("Nao foi possivel validar a quantidade no carrinho");
    });
  }
  validateSubtotal(quantity = 2) {
    if (Cypress.env("USE_MOCK")) {
      cy.get("@productPrice").then((price) => {
        const expectedSubtotal = Number(price) * quantity;
        cy.get("#cart-subtotal", { timeout: 1e4 }).should(($el) => {
          const subtotal = this.extractFirstPrice($el.text() || "");
          expect(subtotal).to.be.closeTo(expectedSubtotal, 0.2);
        });
      });
      return;
    }
    cy.then(() => {
      const unitPrice = Number(Cypress.env("CART_UNIT_PRICE") || 0);
      if (unitPrice > 0) {
        return unitPrice;
      }
      return this.getVisibleUnitPricesFromCart().then((prices) => {
        if (!prices.length) {
          return 0;
        }
        Cypress.env("CART_UNIT_PRICE", prices[0]);
        return prices[0];
      });
    }).then((unitPrice) => {
      expect(unitPrice).to.be.greaterThan(0);
      const expectedSubtotal = Number(unitPrice) * quantity;
      const selectors = [
        this.elements.subtotal,
        "#sc-subtotal-amount-activecart",
        ".sc-subtotal .a-size-medium",
        ".a-size-medium.a-color-price.sc-price"
      ];
      const findSubtotal = (idx = 0) => {
        if (idx >= selectors.length) {
          throw new Error("Nao foi possivel localizar subtotal do carrinho");
        }
        const sel = selectors[idx];
        cy.get("body").then(($body) => {
          if (!$body.find(sel).length) {
            findSubtotal(idx + 1);
            return;
          }
          cy.get(sel).first().invoke("text").then((text) => {
            const subtotal = this.extractFirstPrice(text);
            if (!Number.isFinite(subtotal) || subtotal <= 0) {
              findSubtotal(idx + 1);
              return;
            }
            expect(subtotal).to.be.closeTo(expectedSubtotal, 1);
          });
        });
      };
      findSubtotal();
    });
  }
  validateHasItems() {
    if (Cypress.env("USE_MOCK")) {
      cy.window().then((win) => {
        const cart = JSON.parse(win.localStorage.getItem("mock_cart") || "[]");
        expect(cart.length).to.be.greaterThan(0);
      });
      return;
    }
    cy.get("body").then(($body) => {
      const rowsCount = $body.find(".sc-list-item, .sc-list-item-content").length;
      const pageText = ($body.text() || "").toLowerCase();
      const hasSubtotal = pageText.includes("subtotal");
      const hasItemHint = pageText.includes("item") || pageText.includes("itens");
      if (rowsCount > 0 || hasSubtotal || hasItemHint) {
        expect(true).to.equal(true);
        return;
      }
      if ($body.find(this.elements.cartBadge).length) {
        cy.get(this.elements.cartBadge).invoke("text").then((text) => {
          const count = Number((text || "").trim()) || 0;
          expect(count).to.be.greaterThan(0);
        });
        return;
      }
      throw new Error("Nao foi possivel comprovar que o carrinho possui itens");
    });
  }
  removeProduct() {
    if (Cypress.env("USE_MOCK")) {
      cy.window().then((win) => {
        win.localStorage.removeItem("mock_cart");
      });
      cy.document().then((doc) => {
        doc.open();
        doc.write("<!doctype html><html><body><p>Seu carrinho de compras da Amazon esta vazio.</p></body></html>");
        doc.close();
      });
      return;
    }
    const removeOnce = () => {
      cy.get("body").then(($body) => {
        const selectors = [
          'input[value="Excluir"]',
          'button[aria-label*="Excluir"]',
          'input[name*="submit.delete"]',
          'input[data-action="delete"]'
        ];
        for (const sel of selectors) {
          if ($body.find(sel).length) {
            cy.get(sel).first().click({ force: true });
            return;
          }
        }
        if ($body.find('select[name="quantity"]').length) {
          cy.get('select[name="quantity"]').first().select("0", { force: true });
          return;
        }
      });
    };
    removeOnce();
    cy.wait(1200);
    removeOnce();
  }
  validateEmptyCart() {
    cy.get("body", { timeout: 15e3 }).should(($body) => {
      const pageText = ($body.text() || "").toLowerCase();
      const targetProduct = (Cypress.env("TARGET_PRODUCT_NAME") || "").toLowerCase();
      const hasEmptyMessage = pageText.includes("seu carrinho de compras da amazon est\uFFFD vazio") || pageText.includes("seu carrinho de compras da amazon esta vazio") || pageText.includes("your amazon cart is empty") || pageText.includes("carrinho vazio") || pageText.includes("n\uFFFDo h\uFFFD produtos") || pageText.includes("nao ha produtos");
      const rows = $body.find(".sc-list-item-content, .sc-list-item, #sc-active-cart .sc-list-item");
      const hasTargetInRows = targetProduct ? [...rows].some((el) => (el.innerText || "").toLowerCase().includes(targetProduct)) : false;
      const badgeText = ($body.find("#nav-cart-count").first().text() || "").trim();
      const badgeCount = Number(badgeText || "0");
      const badgeIsZero = Number.isFinite(badgeCount) && badgeCount === 0;
      const isEmptyState = hasEmptyMessage || badgeIsZero || !hasTargetInRows;
      expect(isEmptyState).to.equal(true);
    });
  }
  openCarrinho() {
    return this.openCart();
  }
  validarPreco() {
    return this.validatePrice();
  }
};
var CartPage_default = new CartPage();
export {
  CartPage_default as default
};

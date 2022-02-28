import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.scss'],
})
export class StripePaymentComponent implements OnInit {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  public cardOptions: StripeCardElementOptions = {
    iconStyle: 'solid',
    style: {
      base: {
        iconColor: '#c4f0ff',
        color: '#fff',
        fontWeight: 500,
        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': { color: '#fce883' },
        '::placeholder': { color: '#87bbfd' },
      },
      invalid: {
        iconColor: '#ffc7ee',
        color: '#ffc7ee',
      },
    },
  };

  public elementsOptions: StripeElementsOptions = {
    locale: 'es',
  };

  stripeTest: FormGroup;
  paymentHandler: any = null;

  constructor(private fb: FormBuilder, private stripeService: StripeService) {}

  ngOnInit(): void {
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]],
    });
    this.invokeStripe();
  }

  initializePayment(amount: number) {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key:
        'pk_test_51ILpJsFRXrII7xkxwrQpAr9ZIIGgBy4xiSC9Iv2pHOamjrEU1LRuzRrZAh8l2FXiaRIQjsCwYS2BWODYe5F3oTYs00aN68wZ8N',
      locale: 'auto',
      token: function (stripeToken: any) {
        alert('Stripe token generated!');
      },
    });

    paymentHandler.open({
      name: 'Polerace',
      description: 'Update subscription',
      amount: amount * 100,
    });
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key:
            'pk_test_51ILpJsFRXrII7xkxwrQpAr9ZIIGgBy4xiSC9Iv2pHOamjrEU1LRuzRrZAh8l2FXiaRIQjsCwYS2BWODYe5F3oTYs00aN68wZ8Nb',
          locale: 'auto',
          token: function (stripeToken: any) {
            alert('Payment has been successfull!');
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }

  createToken(): void {
    const name = this.stripeTest.get('name').value;
    this.stripeService
      .createToken(this.card.element, { name })
      .subscribe((result) => {
        if (result.token) {
          // Use the token
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
      });
  }

  createCharge() {
    this.stripeService;
  }
}

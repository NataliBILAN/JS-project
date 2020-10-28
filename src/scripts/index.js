import '../styles/index.scss';

import { tarifs } from './constants';

let payment = {};
let payments = [];

const companies = document.getElementById('companies');
const allCompanies = document.querySelectorAll('.left__company');
const meters = document.getElementById('meters');
const previousValue = document.getElementById('previous');
const currentValue = document.getElementById('current');
const paymentValue = document.getElementById('payment');
const saveButton = document.getElementById('save-btn');
const resetButton = document.getElementById('reset-btn');
const payButton = document.getElementById('pay-btn');
const forPaymentList = document.querySelector('.form__summary-list');
const totalPriceInfo = document.querySelector('.total-price');
const paymentsList = document.querySelector('.right__payments-fields');
const transactionsList = document.querySelector('.transactions__list');

const data = JSON.parse(localStorage.getItem('items'));
console.log(data);

const availablePayments = {
    taxes: 'Налоги',
    water: 'Холодная вода',
    internet: 'Интернет',
    security: 'Охрана',
    exchange: 'Обмен валют'
};


companies.onclick = (e) => {
    const id = e.target.getAttribute('data-id');
    const company = document.querySelector(`[data-id = ${id}]`);    

    allCompanies.forEach(item => {
        item.classList.add('active');
        if(item.dataset.id !== id) {
            item.classList.remove('active');
        }
    });
    
   payment.id = id;
};

meters.onchange = (e) => {
    const value = e.target.value;

    payment.meterId = value;
};

previousValue.oninput = (e) => {
    const value = e.target.value;
    payment.previous = value;

};

currentValue.oninput = (e) => {
    const value = e.target.value;
    payment.current = value;

};

paymentValue.oninput = (e) => {
    const value = e.target.value;
    payment.currentOnDate = value;

};

const getCost = () => {
    const {current, previous, id} = payment;
    const result = (current - previous)*tarifs[`${id}`];
    payment.total = result;
};

const createForPaymentInfo = () => {
    const item = `<li class="list__item">
                    <p><span class="list__item-label">${payment.meterId}</span>
                    <span class="price">$ <b>${payment.total}</b></span>
                    </p>
                  </li>`;

forPaymentList.insertAdjacentHTML('afterbegin', item);
};

const createTotalInfo = () => {
    const newTotalEl = document.createElement('span');
    newTotalEl.setAttribute("id", "new-total");
    const totalValue = payments.reduce((sum,current) => {
        return sum + current.total;}, 0);
    const newTotalValue = Number(totalValue.toFixed(2));
    console.log(newTotalValue);
    newTotalEl.innerHTML = `${newTotalValue}`;

    const newTotal = document.getElementById('new-total');
    const total = document.getElementById('total');

    

    if(payments.length <= 1) {
        totalPriceInfo.replaceChild(newTotalEl, total);
    } 

    if(total) {
        total.innerHTML = `${payment.total}`;
    } 

    if(newTotal) {
        newTotal.innerHTML = `${newTotalValue}`;
    }
};

const createSavedPayments = () => {
    let currentService;
    for(const key in availablePayments) {
        if (key == payment.id) {
            currentService = availablePayments[key];
        }
    }
    console.log('currentService',currentService);
 
    const paymentInfo = `<p class="right__payments-field">
    <label>
      <input type="checkbox" />
      <span>${currentService}</span>
    </label>
  </p>`;

  paymentsList.insertAdjacentHTML("afterbegin", paymentInfo);
};

const createTransaction = (payedService) => {
    // let currentService;
    // for(const key in availablePayments) {
    //     if (key == payment.id) {
    //         currentService = availablePayments[key];
    //     }
    // }
//     const inputs = paymentsList.querySelectorAll("input[type='checkbox']");
//   let payedService;
//     inputs.forEach(item => {
//         if(item.checked === true) {
//             const payedService = item.nextElementSibling.innerHTML;
//         }   
//     });
    const transactionsItem = `<li class="list__item">${payedService} успешно оплачено</li>`;

    transactionsList.insertAdjacentHTML("afterbegin", transactionsItem);
};

saveButton.onclick = (e) => {
    e.preventDefault();
    getCost();
    payments.push(payment);
    createForPaymentInfo();
    createTotalInfo();
    createSavedPayments();
    localStorage.setItem('items', JSON.stringify(payments));
    console.log(JSON.stringify(payments));

    console.log(payments);
    console.log('payment', payment.id);
    payment = {
        id: '',
        meterId: '',
        current: '',
        previous: '',
        currentOnDate: '',
        total: '',
    };

    previousValue.value = '';
    currentValue.value = '';
    paymentValue.value = '';

    allCompanies.forEach(item => {item.classList.remove('active');});
};

const pay = () => {
    const inputs = paymentsList.querySelectorAll("input[type='checkbox']");
  let payedService;
    inputs.forEach(item => {
        if(item.checked === true) {
            payedService = item.nextElementSibling.innerHTML;
            console.log(`${payedService} оплачено`);
            createTransaction(payedService);
        }   
    });
   console.log(payedService);
   
};

resetButton.onclick = (e) => {
    e.preventDefault();
    payments = [];

    console.log(payments);
};

payButton.onclick = (e) => {
    e.preventDefault();
    pay();
};
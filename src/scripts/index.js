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
const paymentsList = document.querySelector('.right__payments-fields');
const transactionsList = document.querySelector('.transactions__list');


const availablePayments = {
    taxes: 'Налоги',
    water: 'Холодная вода',
    internet: 'Интернет',
    security: 'Охрана',
    exchange: 'Обмен валют'
};

const data = JSON.parse(localStorage.getItem('items'));

if(data) {
    const summary = data.map(item => {
        return `<li class="list__item">
        <p><span class="list__item-label">${item.meterId}</span>
        <span class="price">$ <b>${item.total}</b></span>
        </p>
      </li>`;
    });

    let currentService;
    const paymentInfo = data.map(item => {
        for(const key in availablePayments) {
            if (key === item.id) {
                currentService = availablePayments[key];
            }
        }

        return  `<p class="right__payments-field">
                <label>
                    <input type="checkbox" id="${item.id}" />
                    <span>${currentService}</span>
                </label>
                </p>`;
      });
  
    paymentsList.insertAdjacentHTML("afterbegin", paymentInfo.join(''));
    
    forPaymentList.insertAdjacentHTML('afterbegin', summary.join(''));

    payments.push(...data);
}

companies.onclick = (e) => {
    const id = e.target.getAttribute('data-id');
    const company = document.querySelector(`[data-id = ${id}]`);    

    allCompanies.forEach(item => {
        item.classList.add('active');
        if(item.dataset.id !== id) {
            item.classList.remove('active');
        }
    });

    allCompanies.forEach(item => {
        item.classList.remove('error');
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
    const result = (Number(current) - Number(previous))*(tarifs[id]*100);
    const paymentTotal = result/100;

    payment.total = paymentTotal;
};

const createForPaymentInfo = () => {
    getCost();
    const item = `<li class="list__item">
                    <p><span class="list__item-label">${payment.meterId}</span>
                    <span class="price">$ <b>${payment.total}</b></span>
                    </p>
                  </li>`;     

    forPaymentList.insertAdjacentHTML('afterbegin', item);

    payment.payed = false;
};

const createTotalInfo = () => {
    let totalValue;
    
    totalValue = payments.reduce((sum,current) => {
        return sum + Number(current.total);
    }, 0);
    
    const total = document.getElementById('total');
    total.innerHTML = `${totalValue}`;
};

createTotalInfo();

const createSavedPayments = () => {
    let currentService;
    for(const key in availablePayments) {
       if (key === payment.id) {
          currentService = availablePayments[key];
       }
    };
 
    const paymentInfo = `<p class="right__payments-field">
    <label>
      <input type="checkbox" id="${payment.id}" />
      <span>${currentService}</span>
    </label>
  </p>`;

  paymentsList.insertAdjacentHTML("afterbegin", paymentInfo);
};

const createTransaction = (payedService) => {
    const transactionsItem = `<li class="list__item">${payedService} успешно оплачено</li>`;

    transactionsList.insertAdjacentHTML("afterbegin", transactionsItem);
};

saveButton.onclick = (e) => {
    e.preventDefault();
    if(payment.id === undefined || payment.id === '') {
        allCompanies.forEach(item => {
            item.classList.add('error');
        });
        return false;
    }
    
    if(meters.value === '') {
        meters.classList.add('error');
        return false;
    }

    meters.classList.remove('error'); 
    
    if(previousValue.value === '') {
        previousValue.classList.add('error');
        return false;
    }

    previousValue.classList.remove('error');

    if(currentValue.value === ''){
        currentValue.classList.add('error');
        return false;
    }

    currentValue.classList.remove('error');

    payment.payed = false;

    payments.push(payment);

    createForPaymentInfo();
    createTotalInfo();
    createSavedPayments();    

    //LocalStorage
    localStorage.setItem('items', JSON.stringify(payments));    
    
    payment = {
        id: '',
        meterId: '',
        current: '',
        previous: '',
        currentOnDate: '',
        total: '',

    };
    resetValues();
};

const removeElementsFromDom = () => {
    while (forPaymentList.children.length - 1) {
        forPaymentList.removeChild(forPaymentList.firstChild);
    };

    paymentsList.remove();
};

const pay = () => {
    const inputs = paymentsList.querySelectorAll("input[type='checkbox']");
    let payedService;

    inputs.forEach(input => {
        if(input.checked === true && !input.getAttribute("disabled")) {
            payedService = input.nextElementSibling.innerHTML;
            console.log(`${payedService} оплачено`);

            createTransaction(payedService);

            payments.map(i => {
                if(i.id === input.id) {
                    i.payed = true;
                }
            });
            input.setAttribute("disabled", "true");
        }    
    }); 

    if (payments.every(item => item.payed === true)) { 
        removeElementsFromDom();
        localStorage.clear();
        payments = [];
        createTotalInfo();
    }
};

const resetValues = () =>{
    allCompanies.forEach(item => {
        item.classList.remove('active');
    });
    
    previousValue.value = '';
    currentValue.value = '';
    paymentValue.value = '';
    meters.value = '';
};

resetButton.onclick = (e) => {
    e.preventDefault();
    resetValues();
    removeElementsFromDom();
    payments = [];
    localStorage.clear();
    createTotalInfo();
};

payButton.onclick = (e) => {
    e.preventDefault();
    setTimeout(pay, 1000);
};
// ===== 1) عناصر الصفحة (DOM) =====
const billInput      = document.querySelector("#bill");
const peopleInput    = document.querySelector("#people");
const customTipInput = document.querySelector("#custom-tip");
const tipButtons     = document.querySelectorAll(".tip-btn");

const billError      = document.querySelector("#bill-error");
const peopleError    = document.querySelector("#people-error");

const tipAmountEl    = document.querySelector("#tip-amount");
const totalAmountEl  = document.querySelector("#total-amount");
const resetBtn       = document.querySelector("#reset");

// ===== 2) الحالة (State) =====
let bill   = 0;
let tip    = 0;
let people = 0;

// ===== 3) الدوال =====

// تحويل النص إلى رقم (الحقل الفارغ يصبح 0)
function toNumber(value) {
  const n = parseFloat(value);
  return isNaN(n) ? 0 : n;
}

// عرض أو إخفاء رسالة خطأ على حقل
function setError(input, errorEl, message) {
  errorEl.textContent = message;
  input.classList.toggle("invalid", message !== "");
}

// التحقق من الفاتورة وعدد الأشخاص
function validate() {
  // الفاتورة: تظهر رسالة فقط إذا كُتبت قيمة سالبة
  if (billInput.value !== "" && bill < 0) {
    setError(billInput, billError, "Can't be negative");
  } else {
    setError(billInput, billError, "");
  }

  // الأشخاص: تظهر رسالة إذا كُتب صفر أو أقل
  if (peopleInput.value !== "" && people <= 0) {
    setError(peopleInput, peopleError, "Can't be zero");
  } else {
    setError(peopleInput, peopleError, "");
  }
}

// تفعيل زر Reset عند وجود أي إدخال
function updateResetState() {
  const hasInput =
    billInput.value !== "" ||
    peopleInput.value !== "" ||
    customTipInput.value !== "" ||
    tip > 0;
  resetBtn.disabled = !hasInput;
}

// الحساب والعرض
function calculate() {
  validate();
  updateResetState();

  // الشرط: كل القيم يجب أن تكون أكبر من صفر
  if (bill <= 0 || tip <= 0 || people <= 0) {
    tipAmountEl.textContent   = "$0.00";
    totalAmountEl.textContent = "$0.00";
    return;
  }

  const totalTip      = bill * (tip / 100);      // البقشيش الكلي
  const tipPerPerson  = totalTip / people;       // البقشيش للفرد
  const totalPerPerson = (bill + totalTip) / people; // الإجمالي للفرد

  tipAmountEl.textContent   = "$" + tipPerPerson.toFixed(2);
  totalAmountEl.textContent = "$" + totalPerPerson.toFixed(2);
}

// إزالة الحالة النشطة من كل الأزرار
function clearActiveButtons() {
  tipButtons.forEach((btn) => btn.classList.remove("active"));
}

// ===== 4) الأحداث =====

billInput.addEventListener("input", () => {
  bill = toNumber(billInput.value);
  calculate();
});

peopleInput.addEventListener("input", () => {
  people = toNumber(peopleInput.value);
  calculate();
});

tipButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tip = toNumber(btn.dataset.tip);
    clearActiveButtons();
    btn.classList.add("active");
    customTipInput.value = "";
    calculate();
  });
});

customTipInput.addEventListener("input", () => {
  clearActiveButtons();
  tip = toNumber(customTipInput.value);
  calculate();
});

resetBtn.addEventListener("click", () => {
  billInput.value      = "";
  peopleInput.value    = "";
  customTipInput.value = "";
  bill = 0;
  tip = 0;
  people = 0;
  clearActiveButtons();
  calculate();
});

// حالة البداية
calculate();
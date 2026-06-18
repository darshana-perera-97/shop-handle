function toLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getMaxChequeNumber(chequeList) {
  return chequeList.reduce((max, cheque) => {
    const match = cheque.id?.match(/^CHQ-(\d+)$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 8820);
}

export function getNextChequeId(chequeList) {
  return `CHQ-${getMaxChequeNumber(chequeList) + 1}`;
}

function isSameCheque(a, b) {
  if (a.id && b.id && a.id === b.id) return true;

  return (
    a.customer === b.customer &&
    a.chequeNo === b.chequeNo &&
    Number(a.amount) === Number(b.amount)
  );
}

export function extractChequesFromPayments(paymentList) {
  const extracted = [];

  paymentList.forEach((payment) => {
    if (!Array.isArray(payment.cheques) || payment.cheques.length === 0) return;

    payment.cheques.forEach((cheque) => {
      extracted.push({
        id: `PAY-${payment.id}-${cheque.chequeNo}`,
        customer: payment.customer,
        bank: cheque.bank || '—',
        chequeNo: cheque.chequeNo,
        amount: Number(cheque.amount),
        receivedDate: cheque.date,
        bankDate: cheque.conversionDate,
        status: 'to-bank',
        paymentId: payment.id,
      });
    });
  });

  return extracted;
}

export function buildChequeRecords({ chequeList, paymentList }) {
  const merged = [...chequeList];
  const fromPayments = extractChequesFromPayments(paymentList);

  fromPayments.forEach((cheque) => {
    const duplicate = merged.some((existing) => isSameCheque(existing, cheque));
    if (!duplicate) {
      merged.push(cheque);
    }
  });

  return merged.sort((a, b) => {
    const dateCompare = (b.receivedDate || '').localeCompare(a.receivedDate || '');
    if (dateCompare !== 0) return dateCompare;
    return (b.id || '').localeCompare(a.id || '');
  });
}

export function getChequesReadyToBank(chequeList, referenceDate = toLocalDateString()) {
  return chequeList
    .filter((cheque) => cheque.status === 'to-bank' && cheque.bankDate <= referenceDate)
    .sort((a, b) => a.bankDate.localeCompare(b.bankDate));
}

export function createChequesForPayment(payment, filledCheques, chequeList) {
  let nextNumber = getMaxChequeNumber(chequeList) + 1;

  return filledCheques.map((cheque) => {
    const record = {
      id: `CHQ-${nextNumber}`,
      customer: payment.customer,
      bank: cheque.bank?.trim() || '—',
      chequeNo: cheque.chequeNo.trim(),
      amount: Number(cheque.amount),
      receivedDate: cheque.date,
      bankDate: cheque.conversionDate,
      status: 'to-bank',
      paymentId: payment.id,
    };
    nextNumber += 1;
    return record;
  });
}

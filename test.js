import http from 'http';

http.get('http://localhost:5000/api/invoices', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const invoices = JSON.parse(data);
      console.log(invoices.map(inv => ({
        id: inv.id,
        amount: inv.amount,
        paidAmount: inv.paidAmount
      })));
    } catch(e) {
      console.error(e);
    }
  });
});

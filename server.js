const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const createCsvIfNotExist = (filePath) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '주문 시간,품목 이름,수량\n');
    }
};

app.get('/api/items', (req, res) => {
    const items = Array.from({ length: 10 }).map((_, idx) => ({
        id: idx + 1,
        name: `아이템 ${idx + 1}`,
        imageUrl: `item-image-url-${idx + 1}.jpg`
    }));

    res.json(items);
});

app.post('/api/order', (req, res) => {
    const { ordererName, orders } = req.body;

    const currentTime = new Date();
    const formattedTime = `${currentTime.getFullYear()}-${String(currentTime.getMonth() + 1).padStart(2, '0')}-${String(currentTime.getDate()).padStart(2, '0')}-${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`;

    const csvFilePath = `orders_${ordererName}.csv`;
    createCsvIfNotExist(csvFilePath);

    let csvLines = "";
    orders.forEach(order => {
        const { name, quantity } = order;
        csvLines += `${formattedTime},${name},${quantity}\n`;
    });

    fs.appendFile(csvFilePath, csvLines, (err) => {
        if (err) {
            res.status(500).send('서버 오류');
            return;
        }

        res.send('주문이 저장되었습니다.');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


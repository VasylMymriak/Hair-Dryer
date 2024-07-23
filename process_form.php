<?php
session_start();

class Product {
    public $id;
    public $name;
    public $price;

    public function __construct($id, $name, $price) {
        $this->id = $id;
        $this->name = $name;
        $this->price = $price;
    }
}

class Order {
    public $name;
    public $phone;
    public $product;

    public function __construct($name, $phone, Product $product) {
        $this->name = $name;
        $this->phone = $phone;
        $this->product = $product;
    }
}

class TelegramNotifier {
    private $token;
    private $chat_id;
    private $currentDay;

    public function __construct($token, $chat_id) {
        $this->token = $token;
        $this->chat_id = $chat_id;
        $this->currentDay = date('Y-m-d');

        if (!isset($_SESSION['orderCount'])) {
            $_SESSION['orderCount'] = 0;
        }
    }

    public function sendNotification(Order $order) {
        // Перевіряємо, чи настав новий день
        if (date('Y-m-d') !== $this->currentDay) {
            $_SESSION['orderCount'] = 0;
            $this->currentDay = date('Y-m-d');
        }

        $_SESSION['orderCount']++;

        $message = sprintf(
            "*📝 Нове замовлення #%s:*\n\n*👤 Ім'я:* %s\n*📞 Номер телефону:* %s\n*📦 Обраний продукт:* %s\n*💰 Ціна:* %s\n",
            $_SESSION['orderCount'],
            $order->name,
            $order->phone,
            $order->product->name,
            $order->product->price
        );

        $telegramUrl = "https://api.telegram.org/bot{$this->token}/sendMessage?chat_id={$this->chat_id}&text=".urlencode($message)."&parse_mode=Markdown";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $telegramUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $telegramResponse = curl_exec($ch);
        curl_close($ch);

        if (!$telegramResponse) {
            throw new Exception("Помилка відправлення повідомлення");
        }
    }
}

class CRMHandler {
    private $url;
    private $form;

    public function __construct($url, $form) {
        $this->url = $url;
        $this->form = $form;
    }

    public function sendOrder(Order $order) {
        $products = [
            [
                "id" => $order->product->id,
                "name" => $order->product->name,
                "costPerItem" => $order->product->price,
                "amount" => "1"
            ]
        ];

        $values = [
            "form" => $this->form,
            "getResultData" => "1",
            "products" => $products,
            "fName" => $order->name,
            "phone" => $order->phone,
            "payment_method" => "Наложка",
            "nazvaSajtu" => "professional-beauty.in.ua",
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        curl_setopt($ch, CURLOPT_SAFE_UPLOAD, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($values));
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);

        $res = curl_exec($ch);

        if (!$res) {
            throw new Exception("Помилка відправлення замовлення в CRM");
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$selectedOption = isset($_POST['product']) ? trim($_POST['product']) : '';

if ($name === '' || $phone === '' || ($selectedOption === '')) {
    echo "Будь ласка, заповніть всі поля форми, включаючи обрання продукту.";
    exit;
}

$products = [
    '5-nozzles-pink' => new Product('1399', 'Фен стайлер PRO Super Hair Dryer 5 насадок', '1399 грн.'),
    '5-nozzles-blue' => new Product('1399', 'Фен стайлер PRO Super Hair Dryer 5 насадок синій', '1399 грн.'),
    '5-nozzles-grey' => new Product('1399', 'Фен стайлер PRO Super Hair Dryer 5 насадок сірий', '1399 грн.'),
    '1-nozzle-pink' => new Product('999', 'Фен стайлер PRO Super Hair Dryer 1 насадка', '999 грн.'),
];

$selectedProductKey = isset($_POST['product']) ? $_POST['product'] : '';
$selectedProduct = $products[$selectedProductKey];

$order = new Order($name, $phone, $selectedProduct);

$telegramNotifier = new TelegramNotifier("657345392:AAGnmNBtrVeK1ixd_BcgWg6uMCmBmv7nSJs", "-1002020492172");
$telegramNotifier->sendNotification($order);

$crmHandler = new CRMHandler("https://basic.salesdrive.me/handler/", "2eUQ2AjVvCjlDj9Z3cxoDx_Pe9CKhBGTX4p77wlVOq0QyeDohnXlzhMVjjRwr");
$crmHandler->sendOrder($order);

header("Location: thank.html");
exit;
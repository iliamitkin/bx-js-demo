<?php
require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/header.php';
$APPLICATION->SetTitle('BX JS — задачи');
$APPLICATION->IncludeComponent('demo:tasks', '', ['CACHE_TYPE' => 'N']);
require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/footer.php';

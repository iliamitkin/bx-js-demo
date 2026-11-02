<?php
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) { die(); }
$id = 'bx-demo-' . bin2hex(random_bytes(4));
?>
<section id="<?= htmlspecialcharsbx($id) ?>" style="max-width:480px;padding:24px">
    <h2>Задачи: <span data-count>0</span></h2>
    <ul data-list></ul>
    <form>
        <label>Новая задача <input name="title" required maxlength="120" autocomplete="off"></label>
        <button type="submit">Добавить</button>
    </form>
    <p data-status role="status"><?= $arResult['PULL'] ? 'Автообновление включено' : 'Автообновление не настроено' ?></p>
</section>
<script>
BX.ready(function () {
    new BX.Demo.Tasks({
        root: document.getElementById(<?= \Bitrix\Main\Web\Json::encode($id) ?>),
        items: <?= \Bitrix\Main\Web\Json::encode($arResult['ITEMS'], JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>,
        pull: <?= $arResult['PULL'] ? 'true' : 'false' ?>
    });
});
</script>

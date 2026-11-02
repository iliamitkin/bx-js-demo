<?php
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) { die(); }

use Bitrix\Main\Engine\ActionFilter;
use Bitrix\Main\Engine\Contract\Controllerable;
use Bitrix\Main\Loader;

class DemoTasksComponent extends CBitrixComponent implements Controllerable, \Bitrix\Main\Errorable
{
    private $errors = [];

    public function getErrors(): array { return $this->errors; }

    public function getErrorByCode($code)
    {
        foreach ($this->errors as $error) {
            if ($error->getCode() === $code) { return $error; }
        }
        return null;
    }

    public function configureActions(): array
    {
        $filters = [
            new ActionFilter\Authentication(),
            new ActionFilter\HttpMethod([ActionFilter\HttpMethod::METHOD_POST]),
            new ActionFilter\Csrf(),
        ];
        return ['add' => ['prefilters' => $filters]];
    }

    private function sessionKey(): string
    {
        global $USER;
        return 'BX_JS_DEMO_TASKS_' . (int) $USER->GetID();
    }

    private function items(): array
    {
        return $_SESSION[$this->sessionKey()] ?? [];
    }

    public function addAction(string $title): ?array
    {
        global $USER;
        $title = trim($title);
        if ($title === '' || mb_strlen($title) > 120) {
            $this->errors[] = new \Bitrix\Main\Error('Напиши название задачи не длиннее 120 символов', 'INVALID_TITLE');
            return null;
        }
        $items = $this->items();
        if (count($items) >= 20) {
            $this->errors[] = new \Bitrix\Main\Error('Больше 20 задач добавить нельзя', 'LIMIT');
            return null;
        }
        $items[] = $title;
        $_SESSION[$this->sessionKey()] = $items;

        $queued = false;
        if (Loader::includeModule('pull') && CPullOptions::GetQueueServerStatus()) {
            $queued = (bool) CPullStack::AddByUser((int) $USER->GetID(), [
                'module_id' => 'main',
                'command' => 'bxJsDemoTasksChanged',
                'params' => ['items' => $items],
            ]);
        }
        return ['items' => $items, 'pullQueued' => $queued];
    }

    public function executeComponent()
    {
        global $USER;
        if (!$USER->IsAuthorized()) {
            ShowError('Сначала войди в аккаунт');
            return;
        }
        $this->arResult['ITEMS'] = $this->items();
        $this->arResult['PULL'] = Loader::includeModule('pull') && CPullOptions::GetQueueServerStatus();
        if ($this->arResult['PULL']) { CJSCore::Init(['pull']); }
        \Bitrix\Main\UI\Extension::load('demo.tasks');
        $this->includeComponentTemplate();
    }
}

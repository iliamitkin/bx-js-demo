export class Tasks {
  constructor({ root, items, pull }) {
    this.root = root;
    this.form = root.querySelector('form');
    this.status = root.querySelector('[data-status]');

    BX.addCustomEvent(root, 'Demo:tasksChanged', (count) => {
      root.querySelector('[data-count]').textContent = String(count);
    });
    this.render(items);
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.add();
    });

    if (pull && BX.PULL) {
      this.unsubscribe = BX.PULL.subscribe({
        moduleId: 'main',
        command: 'bxJsDemoTasksChanged',
        callback: (params) => {
          this.render(params.items);
          this.status.textContent = 'Список обновился';
        },
      });
      BX.PULL.start().catch(() => {
        this.status.textContent = 'Автообновление не работает. Обнови страницу вручную';
      });
    }
    window.addEventListener('pagehide', (event) => {
      if (!event.persisted && this.unsubscribe) this.unsubscribe();
    }, { once: true });
  }

  render(items) {
    const list = this.root.querySelector('[data-list]');
    list.textContent = '';
    items.forEach((title) => {
      const item = document.createElement('li');
      item.textContent = title;
      list.appendChild(item);
    });
    BX.onCustomEvent(this.root, 'Demo:tasksChanged', [items.length]);
  }

  add() {
    const button = this.form.querySelector('button');
    const input = this.form.elements.title;
    const title = input.value.trim();
    if (!title || button.disabled) return;
    button.disabled = true;
    this.status.textContent = 'Добавляем задачу...';
    BX.ajax.runComponentAction('demo:tasks', 'add', {
      mode: 'class',
      data: { title },
    }).then((response) => {
      this.render(response.data.items);
      input.value = '';
      this.status.textContent = response.data.pullQueued
        ? 'Задача добавлена'
        : 'Задача добавлена. В другой вкладке обнови страницу вручную';
      button.disabled = false;
    }, (response) => {
      this.status.textContent = response.errors && response.errors[0]
        ? response.errors[0].message : 'Не получилось добавить задачу. Попробуй ещё раз';
      button.disabled = false;
    });
  }
}

/* eslint-disable */
this.BX = this.BX || {};
(function (exports) {
  'use strict';

  var Tasks = /*#__PURE__*/function () {
    function Tasks(_ref) {
      var _this = this;
      var root = _ref.root,
        items = _ref.items,
        pull = _ref.pull;
      babelHelpers.classCallCheck(this, Tasks);
      this.root = root;
      this.form = root.querySelector('form');
      this.status = root.querySelector('[data-status]');
      BX.addCustomEvent(root, 'Demo:tasksChanged', function (count) {
        root.querySelector('[data-count]').textContent = String(count);
      });
      this.render(items);
      this.form.addEventListener('submit', function (event) {
        event.preventDefault();
        _this.add();
      });
      if (pull && BX.PULL) {
        this.unsubscribe = BX.PULL.subscribe({
          moduleId: 'main',
          command: 'bxJsDemoTasksChanged',
          callback: function callback(params) {
            _this.render(params.items);
            _this.status.textContent = 'Список обновился';
          }
        });
        BX.PULL.start()["catch"](function () {
          _this.status.textContent = 'Автообновление не работает. Обнови страницу вручную';
        });
      }
      window.addEventListener('pagehide', function (event) {
        if (!event.persisted && _this.unsubscribe) _this.unsubscribe();
      }, {
        once: true
      });
    }
    babelHelpers.createClass(Tasks, [{
      key: "render",
      value: function render(items) {
        var list = this.root.querySelector('[data-list]');
        list.textContent = '';
        items.forEach(function (title) {
          var item = document.createElement('li');
          item.textContent = title;
          list.appendChild(item);
        });
        BX.onCustomEvent(this.root, 'Demo:tasksChanged', [items.length]);
      }
    }, {
      key: "add",
      value: function add() {
        var _this2 = this;
        var button = this.form.querySelector('button');
        var input = this.form.elements.title;
        var title = input.value.trim();
        if (!title || button.disabled) return;
        button.disabled = true;
        this.status.textContent = 'Добавляем задачу...';
        BX.ajax.runComponentAction('demo:tasks', 'add', {
          mode: 'class',
          data: {
            title: title
          }
        }).then(function (response) {
          _this2.render(response.data.items);
          input.value = '';
          _this2.status.textContent = response.data.pullQueued ? 'Задача добавлена' : 'Задача добавлена. В другой вкладке обнови страницу вручную';
          button.disabled = false;
        }, function (response) {
          _this2.status.textContent = response.errors && response.errors[0] ? response.errors[0].message : 'Не получилось добавить задачу. Попробуй ещё раз';
          button.disabled = false;
        });
      }
    }]);
    return Tasks;
  }();

  exports.Tasks = Tasks;

}((this.BX.Demo = this.BX.Demo || {})));

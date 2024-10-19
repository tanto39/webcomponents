class CommentElement extends HTMLElement {
  constructor() {
    super();
    // Получаем шаблон комментария и создаем Shadow DOM
    const template = document.getElementById("comment-template").content;
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.cloneNode(true));

    // Находим элементы управления в шаблоне
    this.replyButton = shadowRoot.querySelector(".reply");
    this.deleteButton = shadowRoot.querySelector(".delete");
    this.likeButton = shadowRoot.querySelector(".like-button");
    this.likeCount = shadowRoot.querySelector(".like-count");
    this.nestedCommentsContainer = shadowRoot.querySelector(".nested-comments");

    // Создаем форму для ответа
    this.replyForm = this.createReplyForm();
    shadowRoot.appendChild(this.replyForm);
  }

  connectedCallback() {
    // Добавляем обработчики событий
    this.replyButton.addEventListener("click", () => this.toggleReplyForm());
    this.deleteButton.addEventListener("click", () => this.deleteComment());
    this.likeButton.addEventListener("click", () => this.incrementLike());
  }

  disconnectedCallback() {
    // Удаляем обработчики событий
    this.replyButton.removeEventListener("click", () => this.toggleReplyForm());
    this.deleteButton.removeEventListener("click", () => this.deleteComment());
    this.likeButton.removeEventListener("click", () => this.incrementLike());
  }

  createReplyForm() {
    // Создаем форму для ответа
    const form = document.createElement("form");
    form.innerHTML = `
          <input type="text" name="reply" class="input-comment" placeholder="Введите ваш комментарий">
          <button type="submit">Ответить</button>
      `;
    form.style.display = "none";
    form.addEventListener("submit", (e) => this.addReply(e));
    return form;
  }

  toggleReplyForm() {
    // Переключаем видимость формы для ответа
    this.replyForm.style.display = this.replyForm.style.display === "none" ? "block" : "none";
  }

  addReply(event) {
    // Обрабатываем добавление ответа
    event.preventDefault();
    const replyContent = this.replyForm.reply.value;
    if (replyContent) {
      const reply = document.createElement("comment-element");
      reply.innerHTML = `<span slot="content">${replyContent}</span>`;
      this.nestedCommentsContainer.appendChild(reply);
      this.replyForm.reset();
      this.replyForm.style.display = "none";
    }
  }

  deleteComment() {
    // Удаляем комментарий
    this.remove();
  }

  incrementLike() {
    // Увеличиваем счетчик лайков
    const currentCount = parseInt(this.likeCount.textContent, 10);
    this.likeCount.textContent = currentCount + 1;
  }
}

customElements.define("comment-element", CommentElement);

class CommentSection extends HTMLElement {
  constructor() {
    super();
    // Создаем контейнер для комментариев и форму для добавления комментария
    this.commentsContainer = document.createElement("div");
    this.appendChild(this.commentsContainer);

    this.form = document.createElement("form");
    this.form.innerHTML = `
          <input type="text" name="comment" class="input-comment" placeholder="Введите ваш комментарий">
          <button type="submit">Добавить комментарий</button>
      `;
    this.form.addEventListener("submit", (e) => this.addComment(e));
    this.appendChild(this.form);
  }

  addComment(event) {
    // Обрабатываем добавление нового комментария
    event.preventDefault();
    const commentContent = this.form.comment.value;
    if (commentContent) {
      const comment = document.createElement("comment-element");
      comment.innerHTML = `<span slot="content">${commentContent}</span>`;
      this.commentsContainer.appendChild(comment);
      this.form.reset();
    }
  }
}

customElements.define("comment-section", CommentSection);

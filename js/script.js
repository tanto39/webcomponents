// Пользовательский элемент комментария
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
    this.replyForm = shadowRoot.querySelector("form");
    this.replyForm.style.display = "none";
  }

  connectedCallback() {
    // Добавляем обработчики событий
    this.replyButton.addEventListener("click", () => this.toggleReplyForm());
    this.deleteButton.addEventListener("click", () => this.deleteComment());
    this.likeButton.addEventListener("click", () => this.incrementLike());
    this.replyForm.addEventListener("submit", (e) => this.addReply(e));
  }

  disconnectedCallback() {
    // Удаляем обработчики событий
    this.replyButton.removeEventListener("click", () => this.toggleReplyForm());
    this.deleteButton.removeEventListener("click", () => this.deleteComment());
    this.likeButton.removeEventListener("click", () => this.incrementLike());
    this.replyForm.removeEventListener("submit", (e) => this.addReply(e));
  }

  toggleReplyForm() {
    // Переключаем видимость формы для ответа
    this.replyForm.style.display = this.replyForm.style.display === "none" ? "block" : "none";
  }

  addReply(event) {
    // Обрабатываем добавление ответа
    event.preventDefault();
    const replyContent = this.replyForm.reply.value;
    const replyAuthor = this.replyForm.author.value ? this.replyForm.author.value : 'Аноним';
    if (replyContent) {
      const reply = document.createElement("comment-element");
      reply.innerHTML = `<span slot="author">${replyAuthor}</span><span slot="content">${replyContent}</span>`;
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

// Пользовательский элемент секции комментариев
class CommentSection extends HTMLElement {
  constructor() {
    super();
    // Получаем шаблон секции комментариев и создаем Shadow DOM
    const template = document.getElementById("comment-section-template").content;
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.cloneNode(true));

    // Находим контейнер для комментариев и форму
    this.commentsContainer = shadowRoot.querySelector(".comments-container");
    this.form = shadowRoot.querySelector("form");
  }

  connectedCallback() {
    // Добавляем обработчик события для формы
    this.form.addEventListener("submit", (e) => this.addComment(e));
  }

  disconnectedCallback() {
    // Удаляем обработчик события для формы
    this.form.removeEventListener("submit", (e) => this.addComment(e));
  }

  addComment(event) {
    // Обрабатываем добавление нового комментария
    event.preventDefault();
    const commentContent = this.form.comment.value;
    const commentAuthor = this.form.author.value ? this.form.author.value : 'Аноним';
    if (commentContent) {
      const comment = document.createElement("comment-element");
      comment.innerHTML = `<span slot="author">${commentAuthor}</span><span slot="content">${commentContent}</span>`;
      this.commentsContainer.appendChild(comment);
      this.form.reset();
    }
  }
}

customElements.define("comment-section", CommentSection);

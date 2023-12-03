class Book:
    def __init__(self, title='', price=0, number_of_pages=0, author='', quantity=0, number_of_sales=0):
        self.title = title
        self.price = price
        self.number_of_pages = number_of_pages
        self.author = author
        self.quantity = quantity
        self.number_of_sales = number_of_sales

    def display_info(self):
        print(f"Назва книжки: {self.title}")
        print(f"Ціна: {self.price} грн")
        print(f"К-сть сторінок: {self.number_of_pages}")
        print(f"Автор: {self.author}")
        print(f"К-сть на складі: {self.quantity}")
        print(f"К-сть продажів: {self.number_of_sales}")
        print("\n")


class BookShop:
    def __init__(self):
        self.books = []

    def add_book(self, book):
        self.books.append(book)

    def remove_book(self, title):
        for book in self.books:
            if book.title == title:
                self.books.remove(book)
                print(f"Книжка {title} була видалена з магазину.\n")
                return
        print(f"Книжка під назвою {title} не знайдена на складі.\n")

    def top_books_by_price(self, n):
        sorted_books = sorted(self.books, key=lambda x: x.price, reverse=True)[:n]
        print(f"Топ-{n} книжок за ціною:")
        for book in sorted_books:
            book.display_info()

       
    def top_books_by_sales(self, n):
        sorted_books = sorted(self.books, key=lambda x: x.number_of_sales, reverse=True)[:n]
        print(f"Топ-{n} книжок за продажем:")
        for book in sorted_books:
            book.display_info()


def main():
    book1 = Book("Притулок", 350, 300, "Меделін Ру", 50, 100)
    book2 = Book("Учень убивці", 200, 250, "Робін Гобб", 30, 80)
    book3 = Book("Машина", 500, 400, "Дарія Піскозуб", 40, 120)

    bookshop = BookShop()
    bookshop.add_book(book1)
    bookshop.add_book(book2)
    bookshop.add_book(book3)

    print("Початковий склад книжок:\n")
    for book in bookshop.books:
        book.display_info()

    bookshop.top_books_by_price(3)
    bookshop.top_books_by_sales(3)

    bookshop.remove_book("Притулок")
    bookshop.remove_book("Код да Вінчі")

    print("Оновлений склад книжок:\n")
    for book in bookshop.books:
        book.display_info()

if __name__ == "__main__":
    main()

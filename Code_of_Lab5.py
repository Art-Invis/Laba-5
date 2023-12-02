class Book:
    def __init__(self, title='', price=0, numberOfPages=0, author='', quantity=0, numberOfSales=0):
        self.title = title
        self.price = price
        self.numberOfPages = numberOfPages
        self.author = author
        self.quantity = quantity
        self.numberOfSales = numberOfSales

    def display_info(self):
        print(f"Назва книжки: {self.title}")
        print(f"Ціна: {self.price} грн")
        print(f"К-сть сторінок: {self.numberOfPages}")
        print(f"Автор: {self.author}")
        print(f"К-сть на складі: {self.quantity}")
        print(f"К-сть продажів: {self.numberOfSales}")
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
        # def get_book_price(book):
        #     return book.price
        # sorted_books = sorted(self.books, key=get_book_price, reverse=True)[:n]

        sorted_books = sorted(self.books, key=lambda x: x.price, reverse=True)[:n]
        print(f"Топ-{n} книжок за ціною:")
        for book in sorted_books:
            book.display_info()

       
    def top_books_by_sales(self, n):
        # def get_book_sales(book):
        #     return book.numberOfSales
        # sorted_books = sorted(self.books, key=get_book_sales, reverse=True)[:n]

        sorted_books = sorted(self.books, key=lambda x: x.numberOfSales, reverse=True)[:n]
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

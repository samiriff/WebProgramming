package sample.exercise.bean;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Book {
  
  public Book(String title, String authorName, int isbn, double price) {
    super();
    this.title = title;
    this.authorName = authorName;
    this.isbn = isbn;
    this.price = price;
  }

  private Book() {
    super();
  }

  private String authorName;
  
  private int isbn;
  
  private double price;
  
  private String title;

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getAuthorName() {
    return authorName;
  }

  public void setAuthorName(String authorName) {
    this.authorName = authorName;
  }

  public int getIsbn() {
    return isbn;
  }

  public void setIsbn(int isbn) {
    this.isbn = isbn;
  }

  public double getPrice() {
    return price;
  }

  public void setPrice(double price) {
    this.price = price;
  }

}

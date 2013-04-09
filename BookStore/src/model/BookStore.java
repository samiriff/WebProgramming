package model;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.Text;
import org.xml.sax.SAXException;

import bean.BookBean;
import bean.BookStoreBean;

/**
 * Represents the entire book store
 * @author ssheriff
 *
 */
public class BookStore {
	
	private BookStoreBean bookStoreBean;	
	
	public BookStore(String path){
		bookStoreBean = new BookStoreBean();		
		populateBookStore(path, bookStoreBean);		
	}
	
	public BookStore(BookStoreBean bookStoreBean){
		this.bookStoreBean = bookStoreBean;
	}
	
	public BookStoreBean getBookStoreBean(){		
		return bookStoreBean;
	}
	
	public BookStoreBean searchByTitle(String title){
		if(title.trim().equals(""))
			return null;
		List<BookBean> bookList = bookStoreBean.getBookList();
		title = title.toLowerCase();
		BookStoreBean searchResults = new BookStoreBean();
		for(BookBean bookBean : bookList){
			if(bookBean.getBookTitle().toLowerCase().indexOf(title) != -1)
				searchResults.addBookBean(bookBean);
		}
		return searchResults;
	}

	public BookBean searchByISBN(String isbn) {		
		List<BookBean> bookList = bookStoreBean.getBookList();	
		for(BookBean bookBean : bookList){
			if(bookBean.getIsbn().equals(isbn))
				return bookBean;
		}
		return null;
	}
	
	/**
	 * Adds the book (with the given isbn), if available, to the current user's shopping cart, and reduces the stock of the book by one.
	 * @param isbn
	 * @return
	 */
	public BookBean addToCart(String isbn){
		BookBean bookBean = searchByISBN(isbn);
		bookBean.addToCart();
		return bookBean;
	}
	
	public boolean insertBook(String path, BookBean bookBean)
	{
		try{
			Logger.getLogger(BookStore.class.getName()).log(Level.SEVERE, "PATH =  " + path);
            File xmlFile = new File(path);
            DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();            
            Document document = documentBuilder.parse(xmlFile);
            
            //Get the root element of the xml Document;
            Node root = document.getFirstChild();
            Logger.getLogger(BookStore.class.getName()).log(Level.SEVERE, "documentElement:" + root.toString());
            Element book = document.createElement("book");
            
            Element name = document.createElement("name");
            name.appendChild(document.createTextNode(bookBean.getBookTitle()));
            Element isbn = document.createElement("isbn");
            isbn.appendChild(document.createTextNode(bookBean.getIsbn()));
            Element author = document.createElement("author");
            author.appendChild(document.createTextNode(bookBean.getAuthor()));
            Element price = document.createElement("price");
            price.appendChild(document.createTextNode("" + bookBean.getPrice()));
            Element imgSrc = document.createElement("imgSrc");
            imgSrc.appendChild(document.createTextNode(bookBean.getImgSrc()));
            Element isBestBook = document.createElement("isBestBook");
            isBestBook.appendChild(document.createTextNode("" + bookBean.isBestBook()));
            Element publishedDate = document.createElement("publishedDate");
            publishedDate.appendChild(document.createTextNode(bookBean.getPublishedDate()));
    		
            book.appendChild(name);
            book.appendChild(isbn);
            book.appendChild(author);
            book.appendChild(price);
            book.appendChild(imgSrc);
            book.appendChild(isBestBook);
            book.appendChild(publishedDate);
            
    		root.appendChild(book);
    		
    		TransformerFactory transformerFactory = TransformerFactory.newInstance();
    		Transformer transformer = transformerFactory.newTransformer();
    		DOMSource source = new DOMSource(document);
    		StreamResult result = new StreamResult(new File(path));
    		transformer.transform(source, result);
     
    		System.out.println("Done");
    		populateBookStore(path, bookStoreBean);
    		return true;
        } catch (SAXException ex) {
            Logger.getLogger(BookStore.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(BookStore.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ParserConfigurationException ex) {
            Logger.getLogger(BookStore.class.getName()).log(Level.SEVERE, null, ex);
        } catch (TransformerConfigurationException ex){
        	Logger.getLogger(BookStore.class.getName()).log(Level.SEVERE, null, ex);
		} catch (TransformerException ex){
			Logger.getLogger(BookStore.class.getName()).log(Level.SEVERE, null, ex);
		}
    
		return false;
	}
	
	public void deleteBook(String path, String isbn){
		try{
			Logger.getLogger(BookStore.class.getName()).log(Level.SEVERE, "PATH =  " + path);
            File xmlFile = new File(path);
            DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();            
            Document document = documentBuilder.parse(xmlFile);
            
            //Get the root element of the xml Document;
            Node root = document.getFirstChild();
            Logger.getLogger(BookStore.class.getName()).log(Level.SEVERE, "documentElement:" + root.toString());
            
            NodeList nList = document.getElementsByTagName("book");			
			
			for (int temp = 0; temp < nList.getLength(); temp++) {			 
				Node nNode = nList.item(temp);			
		 
				if (nNode.getNodeType() == Node.ELEMENT_NODE) {
		 
					Element eElement = (Element) nNode; 
					
					if(eElement.getElementsByTagName("isbn").item(0).getTextContent().equalsIgnoreCase(isbn)){
						root.removeChild(nNode);
						break;									
					}
				}
			}
			
			// write the content into xml file
			TransformerFactory transformerFactory = TransformerFactory.newInstance();
			Transformer transformer = transformerFactory.newTransformer();
			DOMSource source = new DOMSource(document);
			StreamResult result = new StreamResult(new File(path));
			transformer.transform(source, result);
	 
			System.out.println("Done");
			populateBookStore(path, bookStoreBean);
		} catch (ParserConfigurationException pce) {
			pce.printStackTrace();
		} catch (TransformerException tfe) {
			tfe.printStackTrace();
		} catch (IOException ioe) {
			ioe.printStackTrace();
		} catch (SAXException sae) {
			sae.printStackTrace();
		}
	}

	/**
	 * Populates the bookstorebean with data from an XML file
	 * @param path
	 * @param bookStoreBean
	 */
	private void populateBookStore(String path, BookStoreBean bookStoreBean) {
		try{		
			bookStoreBean.clear();
			
			File fXMLFile = new File(path);
			DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
			Document doc = dBuilder.parse(fXMLFile);		
			doc.getDocumentElement().normalize();	
			
			NodeList nList = doc.getElementsByTagName("book");			
			
			for (int temp = 0; temp < nList.getLength(); temp++) {
				 
				Node nNode = nList.item(temp);			
		 
				if (nNode.getNodeType() == Node.ELEMENT_NODE) {
		 
					Element eElement = (Element) nNode;
		 
					String bookName = eElement.getElementsByTagName("name").item(0).getTextContent();
					String isbn = eElement.getElementsByTagName("isbn").item(0).getTextContent();
					String author = eElement.getElementsByTagName("author").item(0).getTextContent();
					int price = Integer.parseInt(eElement.getElementsByTagName("price").item(0).getTextContent());
					String imgSrc = eElement.getElementsByTagName("imgSrc").item(0).getTextContent();
					boolean isBestBook = Boolean.parseBoolean(eElement.getElementsByTagName("isBestBook").item(0).getTextContent());
					String publishedDate = eElement.getElementsByTagName("publishedDate").item(0).getTextContent();
					
					
					bookStoreBean.addBookBean(new BookBean(bookName, isbn, author, price, imgSrc, isBestBook, publishedDate));				
				}
			}
			
			
			
		}catch (Exception e) {
			e.printStackTrace();
	    }
	}
}

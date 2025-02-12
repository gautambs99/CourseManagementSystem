package servlets;

import javafx.embed.swing.SwingFXUtils;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.layout.Pane;
import javafx.scene.shape.Line;
import javafx.scene.text.Font;
import javafx.scene.text.Text;
import javafx.scene.image.WritableImage;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.awt.image.BufferedImage;
import java.io.*;

@WebServlet("/diagram")
public class DiagramServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // Step 1: Generate the diagram as a JavaFX scene
        Pane pane = new Pane();

        // Create labels for courses
        Label introLabel = createLabel("Intro to Programming", 50, 50);
        Label dataStructuresLabel = createLabel("Data Structures", 200, 150);
        Label algorithmsLabel = createLabel("Algorithms", 350, 250);

        // Add lines representing prerequisites
        Line introToDataLine = createLine(150, 75, 200, 150);
        Line dataToAlgorithmsLine = createLine(300, 175, 350, 250);

        // Add nodes and edges to the pane
        pane.getChildren().addAll(introLabel, dataStructuresLabel, algorithmsLabel, introToDataLine, dataToAlgorithmsLine);

        // Create the scene
        Scene scene = new Scene(pane, 500, 400);

        // Step 2: Render the scene to an image
        WritableImage writableImage = new WritableImage(500, 400);
        scene.snapshot(writableImage);

        BufferedImage bufferedImage = SwingFXUtils.fromFXImage(writableImage, null);

        // Step 3: Send the image as a response
        resp.setContentType("image/png");
        OutputStream out = resp.getOutputStream();
        ImageIO.write(bufferedImage, "png", out);
        out.close();
    }

    // Helper method to create a label
    private Label createLabel(String text, double x, double y) {
        Label label = new Label(text);
        label.setFont(new Font("Arial", 14));
        label.setLayoutX(x);
        label.setLayoutY(y);
        return label;
    }

    // Helper method to create a line
    private Line createLine(double startX, double startY, double endX, double endY) {
        Line line = new Line(startX, startY, endX, endY);
        line.setStyle("-fx-stroke: black;");
        return line;
    }
}

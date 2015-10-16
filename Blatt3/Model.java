import java.awt.Image;
import java.awt.image.BufferedImage;
import java.awt.image.ConvolveOp;
import java.awt.image.Kernel;
import java.io.File;
import java.util.Observable;

import javax.imageio.ImageIO;

import com.jhlabs.image.PointillizeFilter;

/**
 * Model separate from the View (extending Observable)
 * @author  Yasna Mindilikova
 * @version 1
 *
 */
public class Model extends Observable {
	
	private boolean blur, distort, sharpen, contrast, invert, bw, zoom, edgeDetection, green, point;
	private boolean blurOld, distortOld, sharpenOld, contrastOld, invertOld, bwOld, zoomOld, edgeDetectedOld, greenOld, pointOld;
	
	
	private boolean gotNewImage;
	private BufferedImage originalImage;
	private BufferedImage filteredImage;
	private String imageName;

	
	private final int THRESHOLD = 127;
	
	private float[] blurValues = {
			1/10f, 1/10f, 1/10f,
			1/10f, 1/10f, 1/10f,
			1/10f, 1/10f, 1/10f
		};
	
	private float[]edgeDetectionValues = {
			0.0f, -1.0f, 0.0f,
			-1.0f, 4.0f, -1.0f,
			0.0f, -1.0f, 0.0f
		};
	
	
	 /**
	   * Constructior for our model, all variables initialised with false
	   * because no effects are activated at first
	   */
	public Model(){
		
		gotNewImage = false;
		blur=false;
		distort=false;
		sharpen=false;
		contrast=false;	
		invert=false;
		bw=false;
		zoom=false;
		edgeDetection=false;
		green=false;
		point=false;

	}


	/**
	   * getter Method for the original picture
	   * @return originalImage
	   */
	public Image getOriginalImage() {
		return originalImage;
	}
	
//getter methd fo the fitlered image	
	public Image getFilteredImage() {
		gotNewImage = false;
		return filteredImage;
	}
	
	public String getName() {
		return imageName;
	}

//set a new image
	public void setImage(String newImage) {
		imageName = newImage;
		
		try {
			originalImage = ImageIO.read(new File(imageName));
		}
		catch (Exception e) {	
		}
		
		filterImage();
		
		gotNewImage = true;
		
		setChanged();
		notifyObservers();
	}
	
	/**
	 * Applying filters to the originalImage in a fixed filter-order.
	 */
	private void filterImage() {
		
		filteredImage = new BufferedImage(originalImage.getWidth(), originalImage.getHeight(), BufferedImage.TYPE_INT_ARGB);
		
		for (int x = 0; x < originalImage.getWidth(); x++)
		{
			for (int y = 0; y < originalImage.getHeight(); y++)
			{
				filteredImage.setRGB(x, y, originalImage.getRGB(x, y));
				
				if (bw) {
					bwFilter(x,y);
				}
				if (invert) {
					invertFilter(x,y);
				}
			}
		}
		if (blur) {
			blurFilter();	
		}
		if (edgeDetection) {
			edgeDetectionFilter();	
		}
		if(green){
			greenFilter();
		}
		if(point){
			pointillizeFilter();
		}
		
	}
	
	
	/**
	 * Convolution for the blur-filter
	 */
	private void blurFilter() {
		Kernel kernel = new Kernel(3,3,blurValues);
		ConvolveOp cOp= new ConvolveOp(kernel);
		cOp.filter(originalImage, filteredImage);
	}
	/**
	 * Convolution for the edge-detection--filter
	 */
	private void edgeDetectionFilter(){
		Kernel kernel = new Kernel(3,3,edgeDetectionValues);
		ConvolveOp cOp= new ConvolveOp(kernel);
		cOp.filter(originalImage,filteredImage);
	}
	
	/**
	 * Green-filter
	 */
 
	private void greenFilter() {
		filteredImage = new BufferedImage(originalImage.getWidth(), originalImage.getHeight(), BufferedImage.TYPE_INT_RGB);
		for( int x = 0; x < originalImage.getWidth(); x++){
			for (int y = 0; y < originalImage.getHeight(); y++){
				int pixel = originalImage.getRGB(x, y);
				int green = (pixel >> 8) & 0xff;
				int targetPixel = green << 8;
				filteredImage.setRGB(x, y, targetPixel);
			}
		}
	}


	
	/**
	 * Black and white filter + Threshold
	 * @param x xPosition
	 * @param y yPosition
	 */
	private void bwFilter(int x, int y) {
		int p = filteredImage.getRGB(x, y);
		int alpha = (p >> 24) & 0xff;
		int red = (p >> 16) & 0xff;
		int green = (p >> 8) & 0xff;
		int blue = (p) & 0xff;
		
		int bwValue;
		
		if (!bw)
			bwValue = (red + green + blue)/3;
		else bwValue = (p) & 0xff;
		
		int newRGB;
		
		if (bwValue >THRESHOLD)
			newRGB = (alpha << 24) + (0 << 16) + (0 << 8) + 0;
		else newRGB = (alpha << 24) + (255 << 16) + (255 << 8) + 255;
		
		filteredImage.setRGB(x, y, newRGB);
	}
		
	/**
	 * Invert-Filter
	 * @param x Pixel
	 * @param y Pixel
	 */
	private void invertFilter(int x, int y) {
		int p = filteredImage.getRGB(x, y);
		int alpha = (p >> 24) & 0xff;
		int red = (p >> 16) & 0xff;
		int green = (p >> 8) & 0xff;
		int blue = (p) & 0xff;
		
		int newRed = 255 - red;
		int newGreen = 255 - green;
		int newBlue = 255 - blue;
		
		int newRGB = (alpha << 24) + (newRed << 16) + (newGreen << 8) + newBlue;
		
		filteredImage.setRGB(x, y, newRGB);
	}
	
	
	/** 
	 * Filter from an external source, Pointillize Filter
	 */
	private void pointillizeFilter(){
		PointillizeFilter pOp = new PointillizeFilter();
		pOp.setFuzziness(0.9f); // oder 0.1f
		pOp.setScale(10f); // oder 1f, 50f;
		pOp.filter(originalImage, filteredImage);
	}
		

//getter methods for the filters
	public boolean blurred() {
		return blur;
	}
	
	public boolean edgeDetected() {
		return edgeDetection;
	}

	public boolean distorted() {
		return distort;
	}

	public boolean sharpened() {
		return sharpen;
	}

	public boolean contrasted() {
		return contrast;
	}

	public boolean inverted() {
		return invert;
	}
	
	public boolean bwed() {
		return bw;
	}
	
	public boolean zoomed() {
		return zoom;
	}
	public boolean greened() {
		return green;
	}
	
	public boolean pointed() {
		return point;
	}
	
	public boolean receivedNewImage() {
		return gotNewImage;
	}
	
	

//activate filters
	public void enableFilter(String filter) {
		if (filter.contains("Blur")){
			this.blur = true;	
		}
		if (filter.contains("Distort")){
			this.distort = true;
		}
		if (filter.contains("Sharpen")){
			this.sharpen = true;
		}
		if (filter.contains("Contrast")){
			this.contrast = true;
		}
		if (filter.contains("Invert")){
			this.invert = true;
		}
		if (filter.contains("B/W")){
			this.bw = true;
		}
		if (filter.contains("Zoom")){
			this.zoom = true;
		}
		if (filter.contains("Edge Detection")){
			this.edgeDetection = true;
		}
		if (filter.contains("Green")){
			this.green = true;
		}
		if (filter.contains("Pointillize")){
			this.point = true;
		}
		
		filterImage();
		gotNewImage = true;
		setChanged();
		notifyObservers();
	}
	
//deactivate specific filter
	
	public void disableFilter(String filter) {
		if (filter.contains("Blur") && blurOld==false){
			this.blur = false;
		}
		if (filter.contains("Distort") && distortOld==false){
			this.distort = false;
		}
		if (filter.contains("Sharpen") && sharpenOld==false){
			this.sharpen = false;
		}
		if (filter.contains("Contrast") && contrastOld==false){
			this.contrast = false;
		}
		if (filter.contains("Invert") && invertOld==false){
			this.invert = false;
		}
		if (filter.contains("B/W") && bwOld==false){
			this.bw = false;
		}
		if (filter.contains("Zoom") && zoomOld==false){
			this.zoom = false;
		}
		if (filter.contains("Edge Detection") && edgeDetectedOld==false){
			this.edgeDetection = false;
		}
		if (filter.contains("Green") && greenOld==false){
			this.green = false;
		}
		if (filter.contains("Pointillize") && pointOld==false){
			this.point = false;
		}
		
		filterImage();
		
		gotNewImage = true;
		setChanged();
		notifyObservers();
		
	}
	
//Deactivatin ALL filters
		public void disableAllFilter(String filter) {
			if (filter.contains("Blur") )
				this.blur = false;

			if (filter.contains("Distort")  )
				this.distort = false;
			
			if (filter.contains("Sharpen")  )
				this.sharpen = false;

			if (filter.contains("Contrast"))
				this.contrast = false;

			if (filter.contains("Invert") )
				this.invert = false;

			if (filter.contains("B/W") )
				this.bw = false;
		
			if (filter.contains("Zoom"))
				this.zoom = false;
			
			if (filter.contains("Edge Detection"))
				this.edgeDetection = false;
			
			if (filter.contains("Green"))
				this.green = false;
			
			if (filter.contains("Pointillize"))
				this.point = false;
			
			filterImage();

			gotNewImage = true;
			setChanged();
			notifyObservers();
		}
	
//filter update	
	public void switchFilter(String filter) {
		if (filter.contains("Blur")){
			this.blur = !blur;
			if(blur){ blurOld = true;
			}else{ blurOld = false;}
		}
		if (filter.contains("Distort")){
			this.distort = !distort;
			if(distort){ distortOld = true;
			}else{ distortOld = false;}
		}
		if (filter.contains("Sharpen")){
			this.sharpen = !sharpen;
			if(sharpen){ sharpenOld = true;
			}else{ sharpenOld = false;}
		}
		if (filter.contains("Contrast")){
			this.contrast = !contrast;
			if(contrast){ contrastOld = true;
			}else{ contrastOld = false;}
		}
		if (filter.contains("Invert")){
			this.invert = !invert;
			if(invert){ invertOld = true;
			}else{ invertOld = false;}
		}
		if (filter.contains("B/W")){
			this.bw = !bw;
			if(bw){ bwOld = true;
			}else{ bwOld = false;}
		}
		if (filter.contains("Zoom")){
			this.zoom = !zoom;
			if(zoom){ zoomOld = true;
			}else{ zoomOld = false;}
		}
		
		if (filter.contains("Edge Detection")){
			this.edgeDetection = !edgeDetection;
			if(edgeDetection){ edgeDetectedOld = true;
			}else{ edgeDetectedOld = false;}
		}
		
		if (filter.contains("Green")){
			this.green = !green;
			if(green){ greenOld = true;
			}else{ greenOld = false;}
		}
		
		if (filter.contains("Pointillize")){
			this.point = !point;
			if(point){ pointOld = true;
			}else{ pointOld = false;}
		}
	
	
		filterImage();
		
		gotNewImage = true;
		setChanged();
		notifyObservers();
	}
	
}	


import os
from tkinter import Tk, Label, Button, filedialog, messagebox
from PIL import Image, UnidentifiedImageError
from psd_tools import PSDImage
from send2trash import send2trash

def resize_image_with_canvas(input_folder, output_folder, size=(868, 868)):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for filename in os.listdir(input_folder):
        input_path = os.path.join(input_folder, filename)
        
        # Process .psd files
        if filename.endswith(".psd"):
            try:
                psd = PSDImage.open(input_path)
                img = psd.topil()  # Convert PSD to a PIL image
                width, height = img.size
            except Exception as e:
                print(f"Error processing PSD {filename}: {e}")
                continue
            
        # Process other image formats
        elif filename.endswith((".jpg", ".jpeg", ".png")):
            try:
                img = Image.open(input_path)
                width, height = img.size
            except UnidentifiedImageError:
                print(f"Skipping file {filename}: Unidentified image format.")
                continue
            except Exception as e:
                print(f"Error processing {filename}: {e}")
                continue
        else:
            # Skip files with unsupported formats
            continue

        # Convert image to RGB if it is in CMYK or another mode
        if img.mode != "RGB":
            img = img.convert("RGB")

        # Resize logic
        if width == height:
            resized_img = img.resize(size)
        else:
            if width > height:
                new_width = size[0]
                new_height = int((new_width / width) * height)
            else:
                new_height = size[1]
                new_width = int((new_height / height) * width)

            resized_img = img.resize((new_width, new_height))

            canvas = Image.new("RGB", size, (255, 255, 255))
            paste_position = ((size[0] - new_width) // 2, (size[1] - new_height) // 2)
            canvas.paste(resized_img, paste_position)
            resized_img = canvas

        # Save as .png in the output folder
        output_filename = os.path.splitext(filename)[0] + ".png"
        resized_img.save(os.path.join(output_folder, output_filename))

    return "Images resized with canvas adjustments and saved as .png successfully."

def process_images():
    # Select the input folder
    input_folder = filedialog.askdirectory(title="Select Input Folder")
    if not input_folder:
        messagebox.showwarning("No Folder Selected", "Please select an input folder to proceed.")
        return

    # Select the output folder
    output_folder = filedialog.askdirectory(title="Select Output Folder")
    if not output_folder:
        messagebox.showwarning("No Folder Selected", "Please select an output folder to proceed.")
        return

    # Process images
    try:
        result_message = resize_image_with_canvas(input_folder, output_folder)
        messagebox.showinfo("Success", f"{result_message}\nOutput Folder: {output_folder}")

        # Optionally clean up the source folder by sending files to trash
        for filename in os.listdir(input_folder):
            file_path = os.path.join(input_folder, filename)
            send2trash(file_path)

        messagebox.showinfo("Cleanup Complete", f"All images in {input_folder} have been moved to the trash.")

    except Exception as e:
        messagebox.showerror("Error", f"An error occurred: {e}")

# Create the GUI
def main():
    root = Tk()
    root.title("Image Resizer")
    root.geometry("400x200")
    root.resizable(False, False)

    message = ("Click the button below to select an input folder and output folder.\n"
               "Resized images will be saved in the selected output folder.")
    label = Label(root, text=message, wraplength=350, justify="center", pady=20)
    label.pack()

    select_button = Button(root, text="Select Folders and Process", command=process_images, padx=20, pady=10)
    select_button.pack(pady=20)

    root.mainloop()

if __name__ == "__main__":
    main()


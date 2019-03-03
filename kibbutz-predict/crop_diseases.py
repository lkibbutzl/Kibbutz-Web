# Import the libraries
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import os
import cv2
import random


DATADIR = "/home/rahul/Desktop/kibbutz-predict/datasets"
CATEGORIES = ["leaf-mold", "yellow-leaf-curl-virus"]

for category in CATEGORIES:
    path = os.path.join(DATADIR, category)
    
    for img in os.listdir(path):
        img_arr = cv2.imread(os.path.join(path, img), cv2.IMREAD_GRAYSCALE)
        plt.imshow(img_arr, cmap="gray")
        plt.show()
        break
    break
    
# print(img_arr) 

IMG_SIZE = 150

new_arr = cv2.resize(img_arr, (IMG_SIZE, IMG_SIZE))
plt.imshow(new_arr, cmap="gray")
plt.show()


# In[4]:


train_data = []

def create_train_data():
    for category in CATEGORIES:
        path = os.path.join(DATADIR, category)
        class_num = CATEGORIES.index(category)

        for img in os.listdir(path):
            try:
                img_arr = cv2.imread(os.path.join(path, img), cv2.IMREAD_GRAYSCALE)
                new_arr = cv2.resize(img_arr, (IMG_SIZE, IMG_SIZE))
                train_data.append([new_arr, class_num])
            except Exception as e:
                pass
            

create_train_data()

print(len(train_data))

random.shuffle(train_data)

X = []
y = []

for features, labels in train_data:
    X.append(features)
    y.append(labels)
    
    
X = np.array(X).reshape(-1, IMG_SIZE, IMG_SIZE, 1)


import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Activation, Flatten, Conv2D, MaxPooling2D



X = X/255.0

model = Sequential()
model.add(Conv2D(64, (3,3), input_shape = X.shape[1:]))
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2,2)))

model.add(Conv2D(64, (3,3)))
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2,2)))

model.add(Flatten())
model.add(Dense(64))

model.add(Dense(4))
model.add(Activation('softmax'))

model.compile(loss="sparse_categorical_crossentropy", optimizer="adam", metrics=['accuracy'])


model.fit(X, y, batch_size=10, epochs=3, validation_split=0.1)

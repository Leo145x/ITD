# ITD - Image Text Detection

## Introduction

ITD (Image Text Detection) is a site that allows customers to upload videos and receive object tracking videos and a CSV file of tags.  
It is recommended that the upload file size should not exceed 100 MB, and the client is expected to get the result in less than 3 minutes.

Web link: [ITD Website](https://www.leo145x.com)

## Project Structure

The project consists of two servers: this repository is responsible for web behavior and database.  
The other server focuses on parsing, uploading videos, and deploys them to S3 buckets.  

For more details on movie processing, see another repository：[video-parsing](https://github.com/Leo145x/video-parsing)


## Frame Example

![Frame Example](https://github.com/Leo145x/ITD/assets/122880911/d133d52d-0df3-462d-9ad6-22ba6b94150c)

## Development

### Front End

- HTML
- CSS
- JavaScript

### Back End

- Python (Flask)
- OpenCV-Python
- RESTful API

### Proxy

- NGINX

### Environment

- Ubuntu 22.04

### Deployment

- Docker

### Version Control

- Git
- GitHub

### Cloud Services

- AWS
- GCP

### Database

- MySQL

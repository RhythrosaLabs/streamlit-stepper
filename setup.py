from setuptools import setup, find_packages

setup(
    name="streamlit-stepper",
    version="0.1.0",
    author="Your Name",
    author_email="you@example.com",
    description="A multi-step wizard component for Streamlit with validation and progress tracking",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/yourusername/streamlit-stepper",
    packages=find_packages(),
    include_package_data=True,
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Framework :: Streamlit",
    ],
    python_requires=">=3.8",
    install_requires=["streamlit>=1.28.0"],
)

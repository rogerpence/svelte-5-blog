---
title: Mapping podman volume to local windows folder
description: Mapping podman volume to local windows folder
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - podman
  - containers
---
To map a Podman volume to a local Windows folder, you need to use the podman machine set command to configure the mapping and then use the -v flag with the podman run command to mount the volume. [[1](https://stackoverflow.com/questions/69298356/how-to-mount-a-volume-from-a-local-machine-on-podman), [2](https://www.redhat.com/en/blog/run-podman-windows)]

Steps:

1. Set the Podman machine to use rootful mode:
    - Open a terminal or command prompt.
    - Run the following command:

|                                             |
| ------------------------------------------- |
| `<br>     podman machine set --rootful<br>` |

This ensures that Podman can access the host's file system. [[1](https://stackoverflow.com/questions/69298356/how-to-mount-a-volume-from-a-local-machine-on-podman)]

1. Create a Podman volume:
    - Use the following command to create a named volume:

|                                               |
| --------------------------------------------- |
| `<br>     podman volume create my_volume<br>` |

Replace my_volume with your desired volume name. [[1](https://stackoverflow.com/questions/69298356/how-to-mount-a-volume-from-a-local-machine-on-podman), [3](https://docs.podman.io/en/latest/markdown/podman-volume-create.1.html)]

1. Mount the volume:
    - Use the podman volume mount command to map the volume to a directory on the host machine:

|                                                                            |
| -------------------------------------------------------------------------- |
| `<br>     podman volume mount my_volume /path/to/local/windows/folder<br>` |

Replace /path/to/local/windows/folder with the actual path to your local Windows folder. [[1](https://stackoverflow.com/questions/69298356/how-to-mount-a-volume-from-a-local-machine-on-podman), [4](https://docs.podman.io/en/latest/markdown/podman-volume-mount.1.html)]

1. Run a container with the mounted volume:
    - Use the -v flag in the podman run command to mount the volume to a directory inside the container:

|                                                                                             |
| ------------------------------------------------------------------------------------------- |
| `<br>     podman run -it --rm -v my_volume:/container/path -t docker.io/bash /bin/bash<br>` |

-   my_volume is the name of the volume you created. [[1](https://stackoverflow.com/questions/69298356/how-to-mount-a-volume-from-a-local-machine-on-podman)]
-   /container/path is the directory inside the container where the volume will be mounted. [[1](https://stackoverflow.com/questions/69298356/how-to-mount-a-volume-from-a-local-machine-on-podman)]
-   docker.io/bash is the image you're running. [[1](https://stackoverflow.com/questions/69298356/how-to-mount-a-volume-from-a-local-machine-on-podman)]
-   /bin/bash is the command to run inside the container. [[1](https://stackoverflow.com/questions/69298356/how-to-mount-a-volume-from-a-local-machine-on-podman)]

Example: [[1](https://stackoverflow.com/questions/69298356/how-to-mount-a-volume-from-a-local-machine-on-podman), [2](https://www.redhat.com/en/blog/run-podman-windows)]

Let's say you want to map a volume named my_data to the Windows folder C:\Users\yourname\Documents\Podman and mount it inside the container at /app/data: [[1](https://stackoverflow.com/questions/69298356/how-to-mount-a-volume-from-a-local-machine-on-podman), [2](https://www.redhat.com/en/blog/run-podman-windows)]

1. podman machine set --rootful
2. podman volume create my_data
3. podman volume mount my_data C:\Users\yourname\Documents\Podman
4. podman run -it --rm -v my_data:/app/data -t docker.io/ubuntu /bin/bash

Now, any changes made in the container's /app/data directory will be reflected in your local Windows folder C:\Users\yourname\Documents\Podman, and vice-versa. [[1](https://stackoverflow.com/questions/69298356/how-to-mount-a-volume-from-a-local-machine-on-podman), [2](https://www.redhat.com/en/blog/run-podman-windows)]

Important Notes: [[2](https://www.redhat.com/en/blog/run-podman-windows), [5](https://stackoverflow.com/questions/77330102/change-podman-storage-folder)]

-   Ensure you have Podman installed and running on your Windows machine. [[2](https://www.redhat.com/en/blog/run-podman-windows), [5](https://stackoverflow.com/questions/77330102/change-podman-storage-folder)]
-   The podman machine set --rootful command may require administrator privileges, according to a post on Stack Overflow. [[1](https://stackoverflow.com/questions/69298356/how-to-mount-a-volume-from-a-local-machine-on-podman)]
-   You might need to adjust the volume name, paths, and container image according to your specific needs. [[1](https://stackoverflow.com/questions/69298356/how-to-mount-a-volume-from-a-local-machine-on-podman), [2](https://www.redhat.com/en/blog/run-podman-windows)]
-   When using a volume created with the podman volume create command, it is typically stored in the ~/.local/share/containers/storage/volumes directory on the host machine, says a Stack Overflow post. [[1](https://stackoverflow.com/questions/69298356/how-to-mount-a-volume-from-a-local-machine-on-podman), [6](https://docs.podman.io/en/stable/markdown/podman.1.html)]

_Generative AI is experimental._

[1] [https://stackoverflow.com/questions/69298356/how-to-mount-a-volume-from-a-local-machine-on-podman](https://stackoverflow.com/questions/69298356/how-to-mount-a-volume-from-a-local-machine-on-podman)

[2] [https://www.redhat.com/en/blog/run-podman-windows](https://www.redhat.com/en/blog/run-podman-windows)

[3] [https://docs.podman.io/en/latest/markdown/podman-volume-create.1.html](https://docs.podman.io/en/latest/markdown/podman-volume-create.1.html)

[4] [https://docs.podman.io/en/latest/markdown/podman-volume-mount.1.html](https://docs.podman.io/en/latest/markdown/podman-volume-mount.1.html)

[5] [https://stackoverflow.com/questions/77330102/change-podman-storage-folder](https://stackoverflow.com/questions/77330102/change-podman-storage-folder)

[6] [https://docs.podman.io/en/stable/markdown/podman.1.html](https://docs.podman.io/en/stable/markdown/podman.1.html)
---
title: Extending a VM's disk size
description: Extending a VM's disk size
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - hyper-v
---
[These instructions worked well](https://www.nakivo.com/blog/increase-disk-size-hyper-v-complete-guide/)

When you extend a VM disk, you first change its disk size properties from the host. This doesn't allocate the new diskspace, it only stakes a claim to it.
After changing the disk size value, start the VM and open `DISKMGMT.MSC` to see the new partition. If there is a "Recovery" partition against the primary partition and the new one, follow the steps below. (other wise, just extending the volume).
but...
If there is a "Health (Recovery Partition)," the newly added volume of the disk will be after that recovery partition.
In the image below, the new, unallocated disk volume appeared after the recovery partition.
![[Extending a VM's disk size.png|500]]
Recovery partitions can be deleted. But you need to use the `override` option to do so.
List the partitions to show their numbers.
Select the recovery partition number.
Then delete the recovery partition.

```
delete partition override
```

That should make the existing volume and the new volume contiguous. Right-click the new volume to extend it.
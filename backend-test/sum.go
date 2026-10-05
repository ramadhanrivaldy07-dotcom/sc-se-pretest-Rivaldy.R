package main

import "sync"

func SumEven(numbers []int, workerCount int) int64 {
	if len(numbers) == 0 {
		return 0
	}

	workerCount = normalizeWorkerCount(workerCount, len(numbers))
	chunkSize := (len(numbers) + workerCount - 1) / workerCount
	partialSums := make(chan int64, workerCount)

	var workers sync.WaitGroup
	for start := 0; start < len(numbers); start += chunkSize {
		end := min(start+chunkSize, len(numbers))
		workers.Add(1)

		go func(chunk []int) {
			defer workers.Done()

			var subtotal int64
			for _, number := range chunk {
				if number%2 == 0 {
					subtotal += int64(number)
				}
			}

			partialSums <- subtotal
		}(numbers[start:end])
	}

	go func() {
		workers.Wait()
		close(partialSums)
	}()

	var total int64
	for subtotal := range partialSums {
		total += subtotal
	}

	return total
}

func normalizeWorkerCount(workerCount, inputSize int) int {
	if workerCount < 1 {
		return 1
	}
	if workerCount > inputSize {
		return inputSize
	}

	return workerCount
}

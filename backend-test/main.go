package main

import "fmt"

const (
	inputSize   = 1_000_000
	workerCount = 4
)

func main() {
	numbers := make([]int, inputSize)
	for index := range numbers {
		numbers[index] = index + 1
	}

	total := SumEven(numbers, workerCount)
	fmt.Printf("Sum of even numbers: %d\n", total)
}

package main

import (
	"fmt"
	"slices"
	"testing"
)

func TestSumEven(t *testing.T) {
	tests := []struct {
		name        string
		numbers     []int
		workerCount int
		want        int64
	}{
		{
			name:        "mixed numbers",
			numbers:     []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10},
			workerCount: 4,
			want:        30,
		},
		{
			name:        "empty slice",
			numbers:     nil,
			workerCount: 4,
			want:        0,
		},
		{
			name:        "odd numbers",
			numbers:     []int{1, 3, 5, 7},
			workerCount: 2,
			want:        0,
		},
		{
			name:        "even numbers",
			numbers:     []int{2, 4, 6, 8},
			workerCount: 2,
			want:        20,
		},
		{
			name:        "negative numbers",
			numbers:     []int{-6, -5, -4, -1, 2},
			workerCount: 3,
			want:        -8,
		},
		{
			name:        "more workers than numbers",
			numbers:     []int{2, 3, 4},
			workerCount: 10,
			want:        6,
		},
		{
			name:        "non-positive worker count",
			numbers:     []int{2, 4, 6},
			workerCount: 0,
			want:        12,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			original := slices.Clone(test.numbers)

			got := SumEven(test.numbers, test.workerCount)

			if got != test.want {
				t.Fatalf("SumEven() = %d, want %d", got, test.want)
			}
			if !slices.Equal(test.numbers, original) {
				t.Fatal("SumEven() modified its input")
			}
		})
	}
}

func TestSumEvenConsistentAcrossWorkerCounts(t *testing.T) {
	numbers := makeRange(1_000_000)
	const want int64 = 250_000_500_000

	for _, workerCount := range []int{1, 2, 4, 16} {
		t.Run(fmt.Sprintf("workers_%d", workerCount), func(t *testing.T) {
			if got := SumEven(numbers, workerCount); got != want {
				t.Fatalf("SumEven() with %d workers = %d, want %d", workerCount, got, want)
			}
		})
	}
}

func BenchmarkSumEven(b *testing.B) {
	numbers := makeRange(1_000_000)

	for _, workerCount := range []int{1, 4} {
		b.Run(fmt.Sprintf("workers_%d", workerCount), func(b *testing.B) {
			for b.Loop() {
				SumEven(numbers, workerCount)
			}
		})
	}
}

func makeRange(size int) []int {
	numbers := make([]int, size)
	for index := range numbers {
		numbers[index] = index + 1
	}

	return numbers
}

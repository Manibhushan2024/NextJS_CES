"use client"

import { useEffect, useRef, useState } from "react"

interface VoiceRecorderProps {
  onRecordingComplete: (url: string | null) => void
}

export function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const chunksRef = useRef<Blob[]>([])
  useEffect(
    () => () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
      if (mediaRecorderRef.current) mediaRecorderRef.current.onstop = null
      if (mediaRecorderRef.current?.state === "recording")
        mediaRecorderRef.current.stop()
      streamRef.current?.getTracks().forEach((track) => track.stop())
    },
    []
  )

  const startRecording = async () => {
    setIsLoading(true)
    setPermissionDenied(false)

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert(
          "Your browser does not support audio recording. Please use Chrome, Firefox, Safari, or Edge."
        )
        setIsLoading(false)
        return
      }

      let stream: MediaStream
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      } catch (error) {
        const issue =
          error instanceof Error
            ? error
            : new Error("Unable to access microphone")
        if (issue.name === "NotAllowedError") {
          setPermissionDenied(true)
          alert(
            "Microphone permission denied. Please allow microphone access to record voice messages."
          )
        } else if (issue.name === "NotFoundError") {
          alert("No microphone found. Please check your audio input device.")
        } else {
          alert(`Error accessing microphone: ${issue.message}`)
        }
        setIsLoading(false)
        return
      }
      streamRef.current = stream

      let mimeType = ""
      const mimeTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/mpeg",
      ]

      for (const type of mimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type
          break
        }
      }

      const mediaRecorderOptions: MediaRecorderOptions = {}
      if (mimeType) {
        mediaRecorderOptions.mimeType = mimeType
      }

      const mediaRecorder = new MediaRecorder(stream, mediaRecorderOptions)
      chunksRef.current = []

      mediaRecorder.onstart = () => {
        setIsRecording(true)
        setRecordingTime(0)
        setIsLoading(false)
        let elapsedSeconds = 0
        timerIntervalRef.current = setInterval(() => {
          elapsedSeconds += 1
          setRecordingTime(elapsedSeconds)
          if (elapsedSeconds >= 60 && mediaRecorder.state === "recording")
            mediaRecorder.stop()
        }, 1000)
      }

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current)
        }
        setIsRecording(false)

        const blob = new Blob(chunksRef.current, {
          type: mediaRecorder.mimeType || mimeType || "audio/webm",
        })
        if (!blob.size || blob.size > 5 * 1024 * 1024) {
          onRecordingComplete(null)
          stream.getTracks().forEach((track) => track.stop())
          alert("Please record a voice message of at most 5MB.")
          return
        }
        const reader = new FileReader()

        reader.onloadend = () => {
          const base64 = reader.result as string
          setRecordedUrl(base64)
          onRecordingComplete(base64)
        }

        reader.readAsDataURL(blob)

        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Unable to record audio")
      setIsLoading(false)
      streamRef.current?.getTracks().forEach((track) => track.stop())
      console.error("Error accessing microphone:", err)

      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setPermissionDenied(true)
      } else if (
        err.name === "NotFoundError" ||
        err.name === "DevicesNotFoundError"
      ) {
        alert("No microphone device found. Please check your audio setup.")
      } else {
        alert(
          `Error accessing microphone: ${err.message || err.name || "Unknown error"}`
        )
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
  }

  const resetRecording = () => {
    setRecordedUrl(null)
    setRecordingTime(0)
    onRecordingComplete(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (permissionDenied) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-yellow-700 dark:text-yellow-400 text-sm">
          🎤 <strong>Microphone access needed:</strong> Please check your
          browser settings and allow microphone access to CastleElevator. Then
          refresh the page and try again.
        </p>
        <p className="text-yellow-700 dark:text-yellow-400 text-xs mt-2">
          If you still have issues, you can submit the form without a voice
          message.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        🎤 Voice Message (Optional)
      </h3>

      {!recordedUrl ? (
        <div className="space-y-4">
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              disabled={isLoading}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              <span className="text-xl">{isLoading ? "⏳" : "🎙️"}</span>
              {isLoading ? "Requesting microphone..." : "Start Recording"}
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">
                    Recording... {formatTime(recordingTime)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={stopRecording}
                className="w-full bg-linear-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                <span className="text-xl">⏹️</span>
                Stop Recording
              </button>
            </div>
          )}

          <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
            Maximum recording time: 60 seconds (5MB)
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-green-200 dark:border-green-800">
            <p className="text-green-700 dark:text-green-400 font-semibold text-sm mb-2">
              ✅ Recording Complete - {formatTime(recordingTime)}
            </p>

            <audio
              src={recordedUrl}
              controls
              className="w-full h-10 rounded-lg"
              controlsList="nodownload"
            />
          </div>

          <button
            type="button"
            onClick={resetRecording}
            className="w-full bg-gray-500 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Record Again
          </button>

          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            Recording will be attached to your inquiry
          </p>
        </div>
      )}
    </div>
  )
}
